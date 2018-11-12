require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const request = require('request');
const uuidv1 = require('uuid/v1');
const db = require('../database/index.js');
const wiki = require('./util/wikipedia.js');
const language = require('./util/googleNaturalLanguageApi.js');

app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(cors());
app.use(express.static(__dirname + '../public/'));

// in memory store of completed transcripts
let cache = {
  completedTranscriptJobs: { },
  prescriptions: { },
  symptoms: [],
  fileNames: []
};

// language.getSentiments();
// language.getEntities();
wiki.titleLookup('nausea')
.then(result => {
  console.log(result);
});
// console.log('test', wiki.titleLookup('nausea'));
/**
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *   REV API UTIL FUNCTIONS
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
let intervalIds = {};

let reattachObject = (symptomsArray, jobs, cb) => {
  console.log('in reattach');
  console.log(cb);
  console.log('\n\n\n');
  console.log(jobs[0].id);
  const monologues = jobs[0].monologues;
  let newSymptoms = [];
  monologues.forEach((e,i)=> {
    e.elements.forEach((e, i)=> {
      symptomsArray.forEach((r, s) => {
        if(e.value === r) {
          newSymptoms.push(e);
          console.log(e);
        };
      })
    })
  })
  console.log(monologues);
  console.log('in server', symptomsArray);
  cb(jobs[0].id, newSymptoms)
};

let tired = (jobId, thing) => {
  db.updateList(jobId, thing);
  console.log(jobId);
}

const dummyFunction = (err, transcriptJobs) => {
  if (err) {
    console.log('error retrieving transcript jobs: ', err);
  } else {
    console.log(transcriptJobs);
    console.log(transcriptJobs[0].monologues);
    let newText = concatenateTranscriptAsScript(transcriptJobs[0].monologues);
    console.log('transcriptJobs: ', transcriptJobs);
    reattachObject = reattachObject.bind(this);
    tired = tired.bind(this);
    console.log('newText: ', transcriptJobs);
    language.getEntities(newText, reattachObject, transcriptJobs, tired);
    // language.getSentiments(newText);
  }
}

const testLang = (jobId) => {
  console.log('in testlang');
  // console.log(reattachObject);
  // console.log(tired);
  console.log('\n\n\n');
  console.log(jobId);
  db.retrieveSingleTranscriptJob(jobId, dummyFunction);
}

const concatenateTranscriptAsScript = (monologues) => {
  let output = '';
  monologues.forEach((e,i)=>{
    e.elements.forEach((e,i)=>{
      output = output + e.value;
    })
  });
  return output;
}

const loadCompletedTranscriptJobIntoMemory = (transcriptJobId) => {
  const headers = {
    'Authorization': `Bearer ${process.env.REV_API_KEY}`,
    'Accept': 'application/vnd.rev.transcript.v1.0+json'
  };

  axios.get(`${process.env.REV_BASE_URL}/jobs/${transcriptJobId}/transcript`, { headers: headers })
    .then(transcript => {
      cache.completedTranscriptJobs[transcriptJobId] = transcript.data.monologues;
      console.log(transcript.data.monologues);
      // console.log(concatenateTranscriptAsScript)
      let newText = concatenateTranscriptAsScript(transcript.data.monologues);
      console.log(newText);
      language.getEntities(newText);
      language.getSentiments(newText);
      let transcriptJobObj = { id: transcriptJobId, monologues: transcript.data.monologues, fileName: cache.fileNames[transcriptJobId], symptoms: [], prescriptions: []};
      db.insertTranscriptJobs(transcriptJobObj, (err, _) => {
        if (err) console.log(`error persisting transcript job ${transcriptJobId} to DB: ${err}`);
        else {
          testLang(transcriptJobId)
          console.log(`successfully persisted transcription job ${transcriptJobId} to DB`);}
      });
    })
    .catch(console.log);
};




const reloadCompletedTranscriptJobIntoMemory = (transcriptJobId) => {
  const headers = {
    'Authorization': `Bearer ${process.env.REV_API_KEY}`,
    'Accept': 'application/vnd.rev.transcript.v1.0+json'
  };

  return axios.get(`${process.env.REV_BASE_URL}/jobs/${transcriptJobId}/transcript`, { headers: headers })
    .then(transcript => {
      console.log(transcript.data.monologues);
      cache.completedTranscriptJobs[transcriptJobId] = transcript.data.monologues;
    })
    .catch(console.log);
};

const stopPollingInterval = (transcriptJobId, transcriptJobStatus) => {
  try {
    if (transcriptJobStatus === 'transcribed') {
      console.log('clearing polling interval');
      clearInterval(intervalIds[transcriptJobId]);
      loadCompletedTranscriptJobIntoMemory(transcriptJobId);
    } else { // failure
      console.log('clearing polling interval');
      clearInterval(intervalIds[transcriptJobId]);
    }
  } catch (err) {
    console.log('error clearing interval: ', err);
    return err;
  }
};

const monitorTranscriptionJob = (transcriptJobId) => {
  const headers = {
    'Authorization': `Bearer ${process.env.REV_API_KEY}`
  };

  axios.get(`${process.env.REV_BASE_URL}/jobs/${transcriptJobId}`, { headers: headers })
    .then(( transcriptJob ) => {
      let currentTranscriptJobStatus = transcriptJob.data.status;
      console.log('polling job status: ', currentTranscriptJobStatus);
      if (currentTranscriptJobStatus === 'transcribed') stopPollingInterval(transcriptJobId, currentTranscriptJobStatus);
      if (currentTranscriptJobStatus === 'failed') {
        console.log('failed transcription job: ');
        stopPollingInterval(transcriptJobId, currentTranscriptJobStatus);
      }
      return false;
    })
    .catch(console.log);
};

const startTranscriptionJobPolling = (transcriptJobId) => {
  let newIntervalId = setInterval(() => monitorTranscriptionJob(transcriptJobId), 2000);
  intervalIds[transcriptJobId] = newIntervalId;
};

/**
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * 
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/../public/index.html'));
});

// Submit audio file for transcription --> REMOTE FILE
// app.post('/api/transcribe', (req, res) => {
//   let { file_url } = req.body;
//   let headers = {
//     'Authorization': `Bearer ${process.env.REV_API_KEY}`
//   };

//   axios.post(`${process.env.REV_BASE_URL}/jobs`, { 'Content-Type': 'application/json', 'media_url': file_url }, { headers: headers })
//     .then( ({ data }) => {
//       console.log('job submitted: ', data);
//       startTranscriptionJobPolling(data.id);
//       res.send('job submitted successfully').status(200);
//     })
//     .catch(console.log);
// });

// serve local file to Rev API
app.post('/api/transcribe', bodyParser.raw({ limit: '50mb' }), (req, res) => {
  let file_url = path.join(__dirname, `/../public/audio-${uuidv1().split('-')[0]}.mp4`);

  fs.writeFile(file_url, req.body, (err) => {
    if (err) throw err;

    let config = {
      url: `${process.env.REV_BASE_URL}/jobs`,
      formData: { media: fs.createReadStream(file_url), type: 'audio/mp4' },
      headers: {
        'Authorization': `Bearer ${process.env.REV_API_KEY}`,
        'Content-Type': 'multipart/form'
      }
    };

    request.post(config, (err, result) => {
      if (err) console.log(err);
      else {
        const transcriptJobId = JSON.parse(result.body).id;
        const mp4FileName = file_url.split('/')[file_url.split('/').length - 1];
        console.log('job submitted: ', transcriptJobId);
        startTranscriptionJobPolling(transcriptJobId);
        cache.fileNames[transcriptJobId] = mp4FileName;
        res.send({'fileName': mp4FileName, 'transcriptJobId': transcriptJobId}).status(200);
      }
    });
  });
});

app.get('/api/retrieve-all-transcripts', (req, res) => {
  db.retrieveTranscriptJobs((err, transcriptJobs) => {
    if (err) {
      console.log('error retrieving transcript jobs: ', err);
      res.sendStatus(500);
    } else {
      res.send(transcriptJobs);
    }
  });
});

// retrieve completed transcript for transcript_id
app.get('/api/retrieve-transcript/:transcriptJobId', (req, res) => {
  let transcriptJobId = req.params.transcriptJobId;

  db.retrieveSingleTranscriptJob(transcriptJobId, (err, transcriptJob) => {
    if (err) {
      console.log('error retrieving single job: ', err);
      res.sendStatus(500);
    } else {
      res.send(transcriptJob);
    }
  });
});

let port = process.env.PORT || 8080;
app.listen(port, () => console.log(`server listening on port ${port}`));

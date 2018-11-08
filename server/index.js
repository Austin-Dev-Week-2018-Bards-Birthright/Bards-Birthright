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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname + '../public/'));

// in memory store of completed transcripts
let cache = {
  completedTranscriptJobs: { },
  prescriptions: { },
  symptoms: { }
};

/**
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *   REV API UTIL FUNCTIONS
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
let intervalIds = {};

const loadCompletedTranscriptJobIntoMemory = (transcriptJobId) => {
  const headers = {
    'Authorization': `Bearer ${process.env.REV_API_KEY}`,
    'Accept': 'application/vnd.rev.transcript.v1.0+json'
  };

  axios.get(`${process.env.REV_BASE_URL}/jobs/${transcriptJobId}/transcript`, { headers: headers })
    .then(transcript => {
      console.log(transcript.data.monologues);
      console.log('cache: ', cache);
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
        console.log('job submitted: ', JSON.parse(result.body).id);
        startTranscriptionJobPolling(JSON.parse(result.body).id);
        res.send(file_url).status(200);
      }
    });
  });
});

// retrieve completed transcript for transcript_id
app.get('/api/retrieve-transcript', (req, res) => {
  let { transcript_id } = req.body;

  // res.send(transcripts[id]).status(200);
});

app.post('/api/audio', bodyParser.raw(), (req, res) => {
  
});

let port = 3000;
app.listen(port, () => console.log(`server listening on port ${port}`));

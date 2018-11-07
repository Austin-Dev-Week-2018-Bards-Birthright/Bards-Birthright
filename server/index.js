require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname + '../public/'));

// in memory store of completed transcripts
let completedTranscriptJobs = {};

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
    })
    .catch(console.log);
};

const stopPollingInterval = (transcriptJobId) => {
  try {
    console.log('clearing polling interval');
    clearInterval(intervalIds[transcriptJobId]);
    loadCompletedTranscriptJobIntoMemory(transcriptJobId);
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
      if (transcriptJob.data.status === 'transcribed') stopPollingInterval(transcriptJobId);
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
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Submit audio file for transcription
app.post('/api/transcribe', (req, res) => {
  let { file_url } = req.body;
  let headers = {
    'Authorization': `Bearer ${process.env.REV_API_KEY}`
  };

  axios.post(`${process.env.REV_BASE_URL}/jobs`, { 'Content-Type': 'application/json', 'media_url': file_url }, { headers: headers })
    .then( ({ data }) => {
      console.log('job submitted: ', data);
      startTranscriptionJobPolling(data.id);
      res.send('job submitted successfully').status(200);
    })
    .catch(console.log);
});

// retrieve completed transcript for transcript_id
app.get('/api/retrieve-transcript', (req, res) => {
  let { transcript_id } = req.body;

  // res.send(transcripts[id]).status(200);
});

app.post('/api/audio', bodyParser.raw(), (req, res) => {
  fs.writeFile('./public/currentAudio.mp3', req.body, (err) => {
      if (err) throw err;
      res.send("Success");
      console.log('The audio file has been saved!');
  })
})

let port = process.env.PORT || 8080;
app.listen(port, () => console.log(`server listening on port ${port}`));

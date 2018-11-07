const axios = require('axios');

// associate intervalID with a transcript job
// once transcript job with given id has completed, look up 
// intervalID and kill
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

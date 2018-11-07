require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname + '../public/'));


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
      res.send('job submitted successfully').status(200);
    })
    .catch(console.log);
});

// retrieve completed transcript for transcript_id
app.get('/api/retrieve-transcript', (req, res) => {
  let { transcript_id } = req.body;

  // res.send(transcripts[id]).status(200);
});

let port = process.env.PORT || 8080;
app.listen(port, () => console.log(`server listening on port ${port}`));

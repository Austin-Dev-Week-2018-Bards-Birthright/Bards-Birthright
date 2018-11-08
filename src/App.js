import React, { Component } from 'react';
// eslint-disable-next-line no-unused-vars
import logo from './logo.svg';
import './App.css';
import Transcript from './components/Transcript.js';
import SymptomList from './components/SymptomList.js';
import PrescriptionList from './components/PrescriptionList.js';
import Recorder from './components/Recorder';
import Player from './components/Player';
import Navbar from './components/Navbar';
import VoiceActivation from './components/VoiceActivation.js';

require('dotenv').config();
// eslint-disable-next-line no-unused-vars
var DBURL = process.env.REACT_APP_DB_URL;
// eslint-disable-next-line no-unused-vars
var REVKEY = process.env.REACT_APP_REV_API_KEY;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeStamp: 0,
      page: 'recorder',
      allTranscripts: [],
      transcriptData: null,
      currentJobId: null,
      currentAudioFile: null,
      recordingState: 'off'
    }
    this.getTimeStamp = this.getTimeStamp.bind(this);
    this.changePage = this.changePage.bind(this);
    this.getAllTranscripts = this.getAllTranscripts.bind(this);
    this.getTranscriptData = this.getTranscriptData.bind(this);
    this.uploadRecording = this.uploadRecording.bind(this);
    this.printPage = this.printPage.bind(this);
    this.tellRecorderToSaveCurrentAudioStream = this.tellRecorderToSaveCurrentAudioStream.bind(this);
    this.tellRecorderToStartRecording = this.tellRecorderToStartRecording.bind(this);
  }

  componentDidMount() {
    this.getAllTranscripts();
  }

  getTimeStamp(timeStamp) {
    this.setState({
      timeStamp: timeStamp
    })
  }

  getAllTranscripts() {
    fetch('http://localhost:8080/api/retrieve-all-transcripts', {
      method: 'GET',
      mode: 'cors'
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        this.setState({
          allTranscripts: data
        }, () => console.log('got data', this.state.allTranscripts))
      })
      .catch(console.log);
                      }

  getTranscriptData(jobId) {
    console.log('a job id', jobId);
    let theJob = null;
    this.state.allTranscripts.forEach(transcript => {
      if (transcript.id === jobId ){
        theJob = transcript;
      }

    })
    this.setState({
      transcriptData: theJob
    }, () => console.log('got transcript', this.state.transcriptData))
    // fetch(`http://localhost:8080/api/retrieve-transcript/${jobId}`, {
    //   method: 'GET',
    //   mode: 'cors'
    // })
    // .then((data)=>{
    //   return data.json();
    // })
    // .then((data)=> {
    //   this.setState({
    //     transcriptData: data
    //   }, console.log(this.state.transcriptData))
    // })
    // .catch (console.log);
  
  }

  changePage(page, currentJobId) {
    console.log(' in changepage: ', page, ' ', currentJobId);
    this.setState({ page, currentJobId }, 
      () => { if (page === 'transcript') {
        console.log('current job id: ', this.state.currentJobId);
        this.getTranscriptData(this.state.currentJobId);
      }});
  }

  uploadRecording(blob) {
    const url = 'http://localhost:8080/api/transcribe'
    const oReq = new XMLHttpRequest();
    oReq.open("POST", url, true);
    oReq.onreadystatechange = () => {
      if(oReq.readyState === 4 && oReq.status === 200) {
        const response = JSON.parse(oReq.responseText);
        this.setState({
          currentJobId: response.transcriptJobId,
          currentAudioFile: response.fileName
        }, ()=>{console.log(this.state.currentAudioFile, this.state.currentJobId)})
      }};
    oReq.setRequestHeader('Content-Type', 'application/octet-stream');
    oReq.send(blob);
  }

  printPage() {
    let newIframe = document.createElement('iframe');
    newIframe.setAttribute('style', 'visibility: hidden');
    newIframe.setAttribute('src', 'http://localhost:8080/');

    let scriptTag = document.createElement('script');
    scriptTag.setAttribute('type', 'text/javascript');
    scriptTag.text = 'window.print()';

    newIframe.appendChild(scriptTag);
    document.body.append(newIframe);
  }

  tellRecorderToStartRecording() {
    console.log('telling recording to start recording')
    this.setState({
      recordingState: 'on'
    });
  }

  tellRecorderToSaveCurrentAudioStream() {
    console.log('telling recording to stop recording and save')
    this.setState({
      recordingState: 'off'
    });
  }

  renderPage() {
    if (this.state.page === 'recorder') {
      return (<>
        <Recorder uploadRecording={this.uploadRecording} recordingState={this.state.recordingState}/>
      </>);
    } else {
      return <>
          <div className='Lists'>
            <SymptomList transcriptData={this.state.transcriptData} />
            <PrescriptionList transcriptData={this.state.transcriptData} />
          </div>
          <Transcript getTimeStamp={this.getTimeStamp} transcriptData={this.state.transcriptData} />
          <Player timeStamp={this.state.timeStamp} transcriptData={this.state.transcriptData} />
        </>;
    }
  }
  
  render() {
    return (
      <>
        <Navbar changePage={this.changePage} transcripts={this.state.allTranscripts} printPage={this.printPage} />
        <VoiceActivation tellRecorderToSaveCurrentAudioStream={this.tellRecorderToSaveCurrentAudioStream} tellRecorderToStartRecording={this.tellRecorderToStartRecording} />
        <div className="App">
          <header className="App-header">
            <h1>Clover</h1>
            {this.renderPage()}
          </header>
        </div>
      </>
    );
  }
}

export default App;

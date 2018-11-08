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
      transcriptData: null,
      currentJobId: null,
      currentAudioFile: null
    }
    this.getTimeStamp = this.getTimeStamp.bind(this);
    this.changePage = this.changePage.bind(this);
    this.getTranscriptData = this.getTranscriptData.bind(this);
    this.uploadRecording = this.uploadRecording.bind(this);
    this.printPage = this.printPage.bind(this);
  }

  getTimeStamp(timeStamp) {
    this.setState({
      timeStamp: timeStamp
    })
  }

  getTranscriptData(jobId) {
    fetch(`http://localhost:8080/api/retrieve-transcript/${jobId}`, {
      method: 'GET',
      mode: 'cors'
    })
    .then((data)=>{
      return data.json();
    })
    .then((data)=> {
      this.setState({
        transcriptData: data[0]
      }, console.log(data))
    })
    .catch (console.log);
  }

  changePage(page) {
    this.setState({ page });
    if(page==='transcript'){
      this.getTranscriptData(this.state.currentJobId);
    }
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

  renderPage() {
    if (this.state.page === 'recorder') {
      return (<>
        <Recorder uploadRecording={this.uploadRecording} />
      </>);
    } else {
      return <>
          <div className='Lists'>
            <SymptomList transcriptData={this.state.transcriptData} />
            <PrescriptionList transcriptData={this.state.transcriptData} />
          </div>
          <Transcript getTimeStamp={this.getTimeStamp} transcriptData={this.state.transcriptData} />
          <Player timeStamp={this.state.timeStamp} currentAudioFile={this.state.currentAudioFile} />
        </>;
    }
  }
  
  render() {
    return (
      <>
        <Navbar changePage={this.changePage} printPage={this.printPage}/>
        <div className="App">
          <header className="App-header">
            <h1>Transcript Buddy</h1>
            {this.renderPage()}
          </header>
        </div >
      </>
    );
  }
}

export default App;

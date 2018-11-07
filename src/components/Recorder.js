import React, { Component } from 'react';
import '../css/Recorder.css';

class Recorder extends Component {
  constructor(props) {
    super(props);
    this.state = { recordingSrc: '', recordPointer: null, blob: null, liveRec: false };
    this.clickStart = this.clickStart.bind(this);
    this.clickStop = this.clickStop.bind(this);
    this.dynamicColor = this.dynamicColor.bind(this);
    this.doneRecording = this.doneRecording.bind(this);
  }

  startRecording(stream) {
    let recorder = new MediaRecorder(stream);
    this.setState({ recordPointer: recorder });
    let data = [];

    recorder.ondataavailable = event => data.push(event.data);
    recorder.start();

    let stopped = new Promise((resolve, reject) => {
      recorder.onstop = resolve;
      recorder.onerror = event => reject(event.name);
    });

    return stopped.then(() => data);
  }

  clickStart() {
    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false
    })
      .then(stream => {
        this.setState({ streamPointer: stream, liveRec: true });
        return this.startRecording(stream)
      })
      .then(recordedChunks => {
        let recordedBlob = new Blob(recordedChunks, { type: "audio/mp3" });
        this.setState({ recordingSrc: URL.createObjectURL(recordedBlob), blob: recordedBlob });
      })
      .catch(console.log);
  }

  clickStop() {
    this.state.recordPointer.state === "recording" && this.state.recordPointer.stop();
    this.state.streamPointer.getTracks().forEach(track => track.stop());
    this.setState({ liveRec: false });
  }

  dynamicColor() {
    if (this.state.liveRec) {
      return "red";
    } else {
      return "white";
    }
  }

  doneRecording() {
    if (this.state.recordingSrc) {
      return (<>
        <audio id="recording" src={this.state.recordingSrc} controls></audio>
        <a id="downloadButton" className="button" href={this.state.recordingSrc} download="test.mp3">
          Download
      </a>
      </>);
    }
  }

  render() {

    return (
      <div style={{ background: this.dynamicColor() }}>
        {this.state.liveRec ? <h1>YOU ARE LIVE RECORDING</h1> : <p>click start to record audio</p>}
        <button id="startBtn" onClick={() => this.clickStart()}>
          Start
        </button>
        <button id="stopBtn" onClick={() => this.clickStop()}>Stop</button>
        {this.doneRecording()}
      </div>
    );
  }
};

export default Recorder;
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

  componentWillReceiveProps(newProps) {
    console.log('new props: ', newProps)
    if (newProps.recordingState === 'on') this.clickStart();
    else if (this.state.liveRec && newProps.recordingState === 'off') this.clickStop();
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
    setTimeout(() => this.props.uploadRecording(this.state.blob), 5000);
  }

  dynamicColor() {
    if (this.state.liveRec) {
      return "red";
    } else {
      return "#282c34";
    }
  }

  doneRecording() {
    if (this.state.recordingSrc) {
      return (<>
        <audio id="recording" src={this.state.recordingSrc} controls></audio>
      </>);
    }
  }

  recordingState() {
    if (this.state.liveRec) {
      return (
        <div className="container">
          <>
            <h1>LIVE RECORDING</h1>
            <div className="blink" id="stopBtn" onClick={() => this.clickStop()}><i className="far fa-stop-circle"></i></div>
          </>
        </div>

      )
    } else {
      return (
        <div className="container">
          <>
            <h2>click to record audio</h2>
            <div id="startBtn" onClick={() => this.clickStart()}>
              <i className="material-icons">&#xe39e;</i>
            </div>
          </>
        </div>
      );
    }
  }

  render() {

    return (
      // <div style={{ background: this.dynamicColor() }}>
      //   {this.recordingState()}
      //   {this.doneRecording()}
      // </div>

      <div>
        {this.recordingState()}
        {this.doneRecording()}
      </div>
    );
  }
};

export default Recorder;
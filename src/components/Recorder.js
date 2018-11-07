import React, { Component } from 'react';

class Recorder extends Component {
  constructor(props) {
    super(props);
    this.state = { recordingSrc: '', recordPointer: null };
    this.clickStart = this.clickStart.bind(this);
    this.clickStop = this.clickStop.bind(this);
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

    return stopped().then(() => data);
  }

  clickStart() {
    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false
    })
      .then(stream => {
        this.setState({ streamPointer: stream });
        return this.startRecording(stream)
      })
      .then(recordedChunks => {
        let recordedBlob = new Blob(recordedChunks, { type: "audio/mp3" });
        this.setState({ recordingSrc: URL.createObjectURL(recordedBlob) });
      })
      .catch(console.log);
  }

  clickStop() {
    this.state.recordPointer.stop();
  }

  render() {
    return (
      <div>
        <button id="startBtn" onClick={() => this.clickStart()}>
          Start
        </button>
        <button id="stopBtn" onClick={() => this.clickStop()}>Stop</button>
        <audio id="recording" controls></audio>
        <a id="downloadButton" className="button" href={this.state.recordingSrc}>
          Download
        </a>
      </div>
    );
  }
};

export default Recorder;
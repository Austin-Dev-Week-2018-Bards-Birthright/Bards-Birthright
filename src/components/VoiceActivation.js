import React, { Component } from 'react';

var recognition = null;

class VoiceActivation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      started: false,
      transcript: ''
    };
    
    this.checkForStart = this.checkForStart.bind(this);
    this.checkForStop = this.checkForStop.bind(this);
  }

  checkForStart() {
    let transcriptWords = this.state.transcript.toLowerCase();
    console.log('in checkForStart')
    if (!this.state.started && transcriptWords.includes('clover') && transcriptWords.includes('start')) {
      console.log('voice activation starting up recording');
      this.setState({
        started: true
      }, () => {
        this.props.tellRecorderToStartRecording();
      });
    }
  }

  checkForStop() {
    let transcriptWords = this.state.transcript.toLowerCase();
    console.log('in checkForStop')
    console.log('started: ', this.state.started)
    if (this.state.started && transcriptWords.includes('clover') && transcriptWords.includes('stop')) {
      console.log('voice activation stopping recording');
      this.setState({
        started: false
      }, () => {
        this.props.tellRecorderToSaveCurrentAudioStream();
      });
    }
  }

  render() {
    let context = this;
    recognition = new(window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();

    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    recognition.onresult = (event) => {
      console.log('You said: ', event.results[0][0].transcript);
      context.setState({
        transcript: event.results[0][0].transcript
      }, () => {
        context.state.started ? context.checkForStop() : context.checkForStart();
      });
    };

    recognition.onaudioend = function () {
      context.checkForStart();
      context.checkForStop();
    }
    recognition.start();

    if (recognition) {
        return (
          <div>
          </div>
        );
      }
    return null;
  }
}

export default VoiceActivation;

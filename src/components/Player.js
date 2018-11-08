import React, { Component } from 'react';

class Player extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      audioSrc: 'currentAudio.mp3', 
      currentTime: 10
    };
  }

  clickJump() {
    if (this.props.timeStamp) {
      document.querySelector('audio#playback').currentTime = this.props.timeStamp;
      document.querySelector('audio#playback').play();
    }
    
  }

  render() {
    this.clickJump();
    return (
      <div>
        <audio id="playback" controls>
          <source src={this.state.audioSrc} type="audio/mp3"></source>
        </audio>
      </div>
    );
  }
};

export default Player;
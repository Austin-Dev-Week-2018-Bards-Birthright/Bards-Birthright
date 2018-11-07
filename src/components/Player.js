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
    document.querySelector('audio#playback').currentTime = this.state.currentTime;
  }

  render() {
    return (
      <div>
        <button id="jumpBtn" onClick={() => this.clickJump()}>Jump</button>
        <audio id="playback" controls>
          <source src={this.state.audioSrc} type="audio/mp3"></source>
        </audio>
      </div>
    );
  }
};

export default Player;
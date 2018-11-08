import React, { Component } from 'react';

class Player extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      // audioSrc: this.props.transcriptData.currentAudioFile, 
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
    return (<>
      {this.props.transcriptData !== null &&
      <div>
        <audio id="playback" controls>
          <source src={this.props.transcriptData.fileName} type="audio/mp4"></source>
        </audio>
      </div>
      }
    </>);
  }
};

export default Player;
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Transcript from './components/Transcript.js';

import SymptomList from './components/SymptomList.js';
import Recorder from './components/Recorder';
import Player from './components/Player';
require('dotenv').config();
var DBURL = process.env.REACT_APP_DB_URL;
var REVKEY = process.env.REACT_APP_REV_API_KEY;

console.log('your rev key is: ', REVKEY);
console.log('your DBURL is: ', DBURL);
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeStamp: 0
    }
    this.getTimeStamp = this.getTimeStamp.bind(this);
  }

  getTimeStamp(timeStamp) {
    this.setState({
      timeStamp: timeStamp
    })
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Recorder></Recorder>
          <p>
            Check console logs to see your keys
          </p>
          <SymptomList />
          <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
            Learn React
          </a>
        </header>
        <Transcript getTimeStamp={this.getTimeStamp} />
        <Player timeStamp={this.state.timeStamp}></Player>
      </div >
    );
  }
}

export default App;

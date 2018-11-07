import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import SymptomList from './components/SymptomList.js';
import Recorder from './components/Recorder';
require('dotenv').config();
var DBURL = process.env.REACT_APP_DB_URL;
var REVKEY = process.env.REACT_APP_REV_API_KEY;

console.log('your rev key is: ', REVKEY);
console.log('your DBURL is: ', DBURL);
class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Check console logs to see your keys
          </p>
        <SymptomList />
          <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
            Learn React
          </a>
        </header>
        <Recorder></Recorder>
      </div >
    );
  }
}

export default App;

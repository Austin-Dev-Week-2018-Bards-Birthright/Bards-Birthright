import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
require('dotenv').config();
var DBURL = process.env.REACT_APP_DB_URL;
var REVKEY = process.env.REACT_APP_REV_API_KEY;

console.log('your rev key is: ', REVKEY);
console.log('your DBURL is: ', DBURL);
class App extends Component {
  render() {
    return <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload. Here is your key:
          </p>
          <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
            Learn React
          </a>
        </header>
      </div>;
  }
}

export default App;

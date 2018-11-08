import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Transcript from './components/Transcript.js';

import SymptomList from './components/SymptomList.js';
import Recorder from './components/Recorder';
import Player from './components/Player';
import Navbar from './components/Navbar';
require('dotenv').config();
var DBURL = process.env.REACT_APP_DB_URL;
var REVKEY = process.env.REACT_APP_REV_API_KEY;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeStamp: 0,
      page: 'recorder'
    }
    this.getTimeStamp = this.getTimeStamp.bind(this);
    this.changePage = this.changePage.bind(this);
  }

  getTimeStamp(timeStamp) {
    this.setState({
      timeStamp: timeStamp
    })
  }

  changePage(page) {
    this.setState({ page });
  }

  renderPage() {
    if (this.state.page === 'recorder') {
      return (<>
        <Recorder />
      </>);
    } else {
      return (<>
        <SymptomList />
        <Transcript getTimeStamp={this.getTimeStamp} />
        <Player timeStamp={this.state.timeStamp} />
      </>);
    }
  }

  render() {
    return (
      <>
        <Navbar changePage={this.changePage} />
        <div className="App">
          <header className="App-header">
            <h1>Transcript Buddy</h1>
            {this.renderPage()}
          </header>
        </div >
      </>
    );
  }
}

export default App;

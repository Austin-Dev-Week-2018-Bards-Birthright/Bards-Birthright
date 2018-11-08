/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';

const options = ['one', 'two', 'three']
const Navbar = (props) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light" >
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div className="navbar-nav">
          <a className="nav-item nav-link" href="#" onClick={() => props.changePage('recorder')}>Recorder</a>
          <a className="nav-item nav-link" href="#" onClick={() => props.changePage('transcript')}>Transcript</a>
          <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Transcripts
              </button>
            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
           { options.map(option => {
              return (
                <a class="dropdown-item" href="#">{option}</a>
              )
            })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
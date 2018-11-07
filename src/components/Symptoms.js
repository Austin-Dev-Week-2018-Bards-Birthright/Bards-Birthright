import React, { Component } from 'react';
import '../App.css';
import { input, output } from '../sampleDataTranscriptionPretty.js';

let SYMPTOM_DICTIONARY = {
  snake: 'snake',
  breakfast: 'breakfast',
  downtown: 'downtown'
};

let SYMPTOMS = []

input.monologues.forEach(speaker => {
  speaker.elements.forEach(textChunk => {
    SYMPTOMS.push(SYMPTOM_DICTIONARY[textChunk.value]);
  });
});

class Symptoms extends Component {
  render() {
    return (
      <div className="Symptoms">
      <p>Here is your list of symptoms we found: </p>
        {SYMPTOMS.map((item, i) => {
          return <p key={i}> {item} </p>;
        })}
      </div>
    );
  }
}

export default Symptoms;

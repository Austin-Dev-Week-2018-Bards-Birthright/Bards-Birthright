import React, { Component } from 'react';
import '../App.css';
import { input, output } from '../sampleDataTranscriptionPretty.js';

class Symptoms extends Component {

  constructor(props) {
    super(props);
    this.state = {
      symptoms : [],
      SYMPTOM_DICTIONARY: {
        snake: 'snake',
        breakfast: 'breakfast',
        downtown: 'downtown'
      }
    };
}
componentDidMount() {
  let symptoms = [];
  input.monologues.forEach(speaker => {
    speaker.elements.forEach(textChunk => {
      symptoms.push(this.state.SYMPTOM_DICTIONARY[textChunk.value]); 
    });
  }) 
  this.setState({symptoms})
}

  render() {
    console.log(this.state.SYMPTOMS);
    return (
      <div className="Symptoms">
      <p>Here is your list of symptoms we found: </p>
        {this.state.symptoms.map((item, i) => {
          return <p key={i}> {item} </p>;
        })}
      </div>
    );
  }
}

export default Symptoms;

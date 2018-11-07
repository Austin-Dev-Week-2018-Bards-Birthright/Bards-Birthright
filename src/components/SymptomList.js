import React, { Component } from 'react';
import '../App.css';
import SymptomListItem from './SymptomListItem.js'
import { input, output } from '../sampleDataTranscriptionPretty.js';

class SymptomList extends Component {

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
      if (this.state.SYMPTOM_DICTIONARY[textChunk.value]) {
        symptoms.push(this.state.SYMPTOM_DICTIONARY[textChunk.value]); 
      } 
    });
  }) 
  this.setState({symptoms})
}

  render() {
    console.log(this.state.SYMPTOMS);
    return (
      <div className="SymptomList">
      <p>Here is your list of symptoms we found: </p>
        {this.state.symptoms.map((item, i) => {
          return <SymptomListItem key={i} symptom={item} />
        })}
        Add A Symptom <button>Add!</button>
      </div>
    );
  }
}

export default SymptomList;

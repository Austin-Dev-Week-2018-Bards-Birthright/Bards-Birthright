import React, { Component } from 'react';
import '../App.css';
import SymptomListItem from './SymptomListItem.js';
import { input, output } from '../sampleDataTranscriptionPretty.js';
import SYMPTOM_DICTIONARY from '../Symptoms.js';
class SymptomList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      symptoms: [],
      isAddingSymptom: false,
      newSymptom: ''
    };

    this.changeText = function(e) {
      this.setState({ newSymptom: e.target.value });
    };
    this.confirmSymptom = function() {
      let newSymptomObj = {
        confidence: 1,
        end_ts: 0,
        ts: -1,
        type: 'symptom',
        value: this.state.newSymptom
      };
      this.setState({ isAddingSymptom: false, symptoms: [...this.state.symptoms, newSymptomObj], newSymptom: '' });
    };
    this.changeText = this.changeText.bind(this);
    this.confirmSymptom = this.confirmSymptom.bind(this);
  }
  componentDidMount() {
    let symptoms = [];
    if (input.symptoms.length < 1){
    input.monologues.forEach(speaker => {
      speaker.elements.forEach(textChunk => {
        if (SYMPTOM_DICTIONARY[textChunk.value]) {
          symptoms.push(textChunk);
        }
      });
    });
    } else {
      //set state to input.symtoms
    }
    //send to DB
    this.setState({ symptoms });
  }

  render() {
    return (
      <div className="List">
        <p>Here is your list of symptoms we found: </p>
        {this.state.symptoms.map((item, i) => {
          return <SymptomListItem key={i} symptom={item} />;
        })}
        {this.state.isAddingSymptom ? (
          <div>
            <input
              type="text"
              value={this.state.newSymptom}
              onChange={this.changeText}
            />
            <button onClick={this.confirmSymptom}>Confirm</button>
          </div>
        ) : (
          <div>
            Add A Symptom
            <button onClick={() => this.setState({ isAddingSymptom: true })}>
              Add!
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default SymptomList;

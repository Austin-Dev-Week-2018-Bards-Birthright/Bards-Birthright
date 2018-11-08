import React, { Component } from 'react';
import '../App.css';
import PrescriptionListItem from './PrescriptionListItem.js';
import { input, output } from '../sampleDataTranscriptionPretty.js';
import PRESCRIPTION_DICTIONARY from '../Prescriptions.js';
class PrescriptionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prescriptions: [{value: 'meth'}, {value: 'nicotine'}, {value: 'vicoden'}],
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
        type: 'text',
        value: this.state.newSymptom
      };
      this.setState({ isAddingSymptom: false, symptoms: [...this.state.symptoms, newSymptomObj], newSymptom: '' });
    };
    this.changeText = this.changeText.bind(this);
    this.confirmSymptom = this.confirmSymptom.bind(this);
  }
  componentDidMount() {
    // let symptoms = [];
    // input.monologues.forEach(speaker => {
    //   speaker.elements.forEach(textChunk => {
    //     if (SYMPTOM_DICTIONARY[textChunk.value]) {
    //       symptoms.push(textChunk);
    //     }
    //   });
    // });
    // this.setState({ symptoms });
  }

  render() {
    return <div className="PrescriptionList">
        <p>Here is your list of prescriptions we found: </p>
        {this.state.prescriptions.map((item, i) => {
          return <PrescriptionListItem key={i} prescription={item} />;
        })}
        {this.state.isAddingSymptom ? <div>
            <input type="text" value={this.state.newSymptom} onChange={this.changeText} />
            <button onClick={this.confirmSymptom}>Confirm</button>
          </div> : <div>
            Add A Symptom <button
              onClick={() => this.setState({ isAddingSymptom: true })}
            >
              Add!
            </button>
          </div>}
      </div>;
  }
}

export default PrescriptionList;

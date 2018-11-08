import React, { Component } from 'react';
import '../App.css';
import PrescriptionListItem from './PrescriptionListItem.js';
import { input, output } from '../sampleDataTranscriptionPretty.js';
import PRESCRIPTION_DICTIONARY from '../Prescriptions.js';
class PrescriptionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prescriptions: [],
      isAddingPrescription: false,
      newPrescription: '',
      output
    }; 
    this.changeText = function(e) {
      this.setState({ newPrescription: e.target.value });
    };
    this.confirmPrescription = function() {
      let newPrescriptionObj = { confidence: 1, end_ts: 0, ts: -1, type: 'text', value: this.state.newPrescription };
      this.setState({
        isAddingPrescription: false,
        prescriptions: [...this.state.prescriptions, newPrescriptionObj],
        newPrescription: ''
      });
    };
    this.changeText = this.changeText.bind(this);
    this.confirmPrescription = this.confirmPrescription.bind(this);
  }
  componentDidMount() {
    let prescriptions = [];
    input.monologues.forEach(speaker => {
      speaker.elements.forEach(textChunk => {
        if (PRESCRIPTION_DICTIONARY[textChunk.value]) {
          prescriptions.push(textChunk);
        }
      });
    });
    this.setState({ prescriptions });

    this.sentences = [];
    let sentence = '';
    Array.from(this.state.output).forEach((e)=> {
      if (e === '.' || e === '?') {
        this.sentences.push(sentence + e)
        sentence = ''
      } else {
        sentence += e;
      }
    });

  }

  render() {
    return <div className="List">
        <p>Here is your list of prescriptions we found: </p>
        {this.state.prescriptions.map((item, i) => {
          return <PrescriptionListItem key={i} prescription={item} sentences={this.sentences} />;
        })}
        {this.state.isAddingPrescription ? <div>
            <input type="text" value={this.state.newPrescription} onChange={this.changeText} />
            <button onClick={this.confirmPrescription}>Confirm</button>
          </div> : <div>
            Add A Prescription <button
              onClick={() => this.setState({ isAddingPrescription: true })}
            >
              Add!
            </button>
          </div>}
      </div>;
  }
}

export default PrescriptionList;

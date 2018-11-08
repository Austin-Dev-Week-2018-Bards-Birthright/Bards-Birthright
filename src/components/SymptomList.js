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
      isClicked: false,
      newSymptom: '',
      output,
      transcriptData: {}
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

  componentWillReceiveProps(props) {
    // console.log('new props SymptomList', props.transcriptData);
    this.setState({ transcriptData: props.transcriptData }, () => {
      // console.log('transcript data', this.state.transcriptData);
      let symptoms = [];
      // console.log('object keys length ', Object.keys(this.state.transcriptData).length);
      if (Object.keys(this.state.transcriptData).length) {
        this.state.transcriptData.monologues.forEach(speaker => {
          // console.log('speaker: ', speaker);
          speaker.elements.forEach(textChunk => {
            // console.log('textchunk ', textChunk);
            if (SYMPTOM_DICTIONARY[textChunk.value.toLowerCase()]) {
              if (textChunk.value.toLowerCase() === 'headache'){
                textChunk.confidence = .1;
              }
              symptoms.push(textChunk);
            }
          });
        });
      }
      this.setState({ symptoms });
    }
    )
  }

  render() {
    return <div className="List">
        <p>Here is your list of symptoms we found: </p>

        {this.state.symptoms.map((item, i) => {
          return <SymptomListItem key={i} symptom={item} sentences={this.sentences} />;
        })}
        {this.state.isAddingSymptom ? <div>
            <input type="text" value={this.state.newSymptom} onChange={this.changeText} />
            <button className="btn-xs" onClick={this.confirmSymptom}>
              Confirm
            </button>
          </div> : <div>
            Add A Symptom
            <button className="add btn-xs" onClick={() => this.setState({
                  isAddingSymptom: true
                })}>
              <i class="add fas fa-plus"></i>
            </button>
          </div>}
      </div>;
  }
}

export default SymptomList;

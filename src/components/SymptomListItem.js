import React, { Component } from 'react';

let CONFIDENCE_DICTIONARY = {
  1: '#FF0000',
  2: '#FF0000',
  3: '#FF0000',
  4: '#FFFF00',
  5: '#E5FF00',
  6: '#CAFF00',
  7: '#ADFF00',
  8: '#8CFF00',
  9: '#62FF00',
  10: '#62FF00'
};

class SymptomListItem extends Component {
  constructor(props) {
    super(props);
    this.save = function () {
      console.log('wow you saved! ', this.props.symptom.value);
    };
    this.edit = function () {
      console.log('wow you edited!', this.props.symptom.value);
    };
    this.save = this.save.bind(this);
    this.edit = this.edit.bind(this);
  }

  render() {
    return <div>     
      <b style={{ color: CONFIDENCE_DICTIONARY[Math.floor(this.props.symptom.confidence * 10)]}}>{this.props.symptom.value} </b> <button onClick={this.save}>save</button> <button onClick={this.edit}>edit</button>
      </div>;
  }
}

export default SymptomListItem;

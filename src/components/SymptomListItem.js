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
  
  render() {
    console.log(Math.floor(this.props.symptom.confidence * 10));
    return <div>

     
      <b style={{ color: CONFIDENCE_DICTIONARY[Math.floor(this.props.symptom.confidence * 10)]}}>{this.props.symptom.value} </b> <button>save</button> <button>edit</button>
      </div>;
  }
}

export default SymptomListItem;

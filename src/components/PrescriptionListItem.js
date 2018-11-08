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
    this.state = {
      prescription : this.props.prescription,
      isEditing: false
    } 
    this.save = function () {
      this.setState({ prescription: { ...this.state.prescription, confidence: 1 } }) 
    };
    this.edit = function () {
      this.setState({
        isEditing: true
      })
    };

    this.changeText = function (e) {
      this.setState({ prescription: { ...this.state.prescription, value: e.target.value, confidence: 1 } }) 
    }
    this.save = this.save.bind(this);
    this.edit = this.edit.bind(this);
    this.changeText = this.changeText.bind(this);
  }

  render() {
    return (
    this.state.isEditing ?
    <div>
          <input type="text" value={this.state.prescription.value} onChange={this.changeText} />
          <button onClick={() => this.setState({isEditing: false})}>Confirm</button> 
    </div>
        :
    <div>     
      <b style={{ color: CONFIDENCE_DICTIONARY[Math.floor(this.state.prescription.confidence * 10)]}}>{this.state.prescription.value} </b> 
      <button onClick={this.save}>save</button> 
      <button onClick={this.edit}>edit</button>
      </div>
      )
  }
}

export default SymptomListItem;

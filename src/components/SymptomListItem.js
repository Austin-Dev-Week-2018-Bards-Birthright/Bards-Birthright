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
      symptom : this.props.symptom,
      isEditing: false,
      context: ''
    }
    this.save = function () {
      this.setState({ symptom: { ...this.state.symptom, confidence: 1 } }) 
    };
    this.edit = function () {
      this.setState({
        isEditing: true
      })
    };

    this.delete = function () {
      this.setState({ symptom: {} })
    };

    this.changeText = function (e) {
      this.setState({ symptom: { ...this.state.symptom, value: e.target.value, confidence: 1 } }) 
    }
    this.save = this.save.bind(this);
    this.edit = this.edit.bind(this);
    this.handleClick = function () {
      this.setState({isClicked : !this.state.isClicked})
      console.log(' here is the context of that word ', this.state.context);
    }
    this.handleClick = this.handleClick.bind(this);
    this.changeText = this.changeText.bind(this);
    this.delete = this.delete.bind(this);
  }

  componentDidMount() {
    this.props.sentences.forEach((sentence, i) => {
      if (sentence.includes(this.props.symptom.value)) {
        let context = sentence;
        if (i > 0){
          context = this.props.sentences[i-1] + context;
        }
        if (i < this.props.sentences.length-1) {
          context += this.props.sentences[i+1];
        }
        this.setState({context})
      }
    });
  }

  render() {
    return this.state.isEditing ? <div>
        <input type="text" value={this.state.symptom.value} onChange={this.changeText} />
        <button onClick={() => this.setState({ isEditing: false })}>
          Confirm
        </button>
      </div> : <div>
        {this.state.isClicked ? 
        <b onClick={this.handleClick}> {this.state.context}</b>
        :
        <div>
        <b
        onClick={this.handleClick}
          style={{
            color:
              CONFIDENCE_DICTIONARY[
                Math.floor(this.state.symptom.confidence * 10)
              ]
          }}
        >
          {this.state.symptom.value}{' '}
        </b>
        <button onClick={this.save}>approve</button>
        <button onClick={this.edit}>edit</button>
        <button onClick={this.delete}>delete</button>
        </div>
        }
      </div>;
  }
}

export default SymptomListItem;

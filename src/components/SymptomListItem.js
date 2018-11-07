import React, { Component } from 'react';

class SymptomListItem extends Component {
  render() {
    return <div>
        {this.props.symptom}  <button>save</button> <button>edit</button>
      </div>;
  }
}

export default SymptomListItem;

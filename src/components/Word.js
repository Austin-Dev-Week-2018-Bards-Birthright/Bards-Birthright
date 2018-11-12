import React from 'react';

class Word extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      element: this.props.element
    };
  }
  componentWillReceiveProps(props) {
    // console.log('changing the word', props.element);
    this.setState({ element: props.element });
  }

  render() {
    return (
      <span
        className="word"
        onClick={() => {
          this.props.getTimeStamp(this.state.element.ts);
          console.log('clicked');
        }}
      >
        {this.state.element.value}
      </span>
    );
  }
}

export default Word;

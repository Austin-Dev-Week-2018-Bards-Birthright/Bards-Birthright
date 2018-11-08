import React from 'react';
import Paragraph from './Paragraph.js';
// eslint-disable-next-line no-unused-vars
import { input, output } from '../sampleDataTranscriptionPretty.js';

class Transcript extends React.Component {
  constructor(props) {
		super(props);
		this.state = {
			input: this.props.transcriptData
		}
	}

	componentWillReceiveProps(props) {
		console.log('changing the state', props.transcriptData);
		this.setState({ input: props.transcriptData })
	}

	render() {
		return (<>
      {this.state.input !== null && 
        <div className='transcript'>{
					this.state.input.monologues.map((element, index) => {
						console.log(' an element ', element);
						return <Paragraph key={index} monologue={element} getTimeStamp={this.props.getTimeStamp} />
					})}</div>}
      </>
		)
	}
}

export default Transcript;
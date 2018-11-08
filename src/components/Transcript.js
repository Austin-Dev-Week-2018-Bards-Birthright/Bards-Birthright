import React from 'react';
import Paragraph from './Paragraph.js';
import { input, output } from '../sampleDataTranscriptionPretty.js';

class Transcript extends React.Component {
  constructor(props) {
		super(props);
		this.state = {
			input: input
		}

	}

	render() {
		return (
			<div className='transcript'>
        {
					this.state.input.monologues.map((element, index) => {
						return <Paragraph key={index} monologue={element} getTimeStamp={this.props.getTimeStamp}/>
					})
				}
			</div>
		)
	}
}

export default Transcript;
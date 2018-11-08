import React from 'react';
import Paragraph from './Paragraph.js';
// eslint-disable-next-line no-unused-vars
import { input, output } from '../sampleDataTranscriptionPretty.js';

class Transcript extends React.Component {
  constructor(props) {
		super(props);
		this.state = {
			input: input
		}
console.log('props', props);
	}

	render() {
		return (<>
      {this.props.transcriptData !== null && 
        <div className='transcript'>
        {
					this.props.transcriptData.monologues.map((element, index) => {
						return <Paragraph key={index} monologue={element} getTimeStamp={this.props.getTimeStamp}/>
					})
        }
        <div>{this.props.transcriptData !== null && <div>{this.props.transcriptData.monologues[0].elements[0].value}</div>}</div>
      </div>
      }
      </>
		)
	}
}

export default Transcript;
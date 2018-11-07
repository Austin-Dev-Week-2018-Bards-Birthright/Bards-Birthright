import React from 'react';
import Word from './Word.js';

class Paragraph extends React.Component {
  constructor(props) {
		super(props);
		this.state = {
			content: this.props.monologue
		}

	}

	render() {
		return (
			<div>
        <h2>
					Speaker {this.state.content.speaker}:
				</h2>
				<div>
					{
						this.state.content.elements.map((element, index) => {
							return <Word key={index} element={element} />
						})
					}
				</div>
			</div>
		)
	}
}

export default Paragraph;
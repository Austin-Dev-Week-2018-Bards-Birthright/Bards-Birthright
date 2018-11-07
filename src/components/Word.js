import React from 'react';

class Word extends React.Component {
  constructor(props) {
		super(props);
		this.state = {
			element: this.props.element
		}

	}

	render() {
		return (
			<span>
				{this.state.element.value}
			</span>
		)
	}
}

export default Word;
import React, { Component } from 'react';

export default class CumPosRateRenderer extends Component {
  constructor(props) {
    super(props);
  }

	getValue() {
		const raw = this.props.value;
		const value = raw.substring(0, raw.length - 1);
		return value;
			
	}

  render() {
    return (
      <span>
        {this.getValue()}
      </span>
    );
  }
}
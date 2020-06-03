import React, { Component } from 'react';
import upIcon from "./images/up red.png"
import downIcon from "./images/down green.png"

export default class PosRateRenderer extends Component {
  constructor(props) {
    super(props);
  }

	getValue() {
		const data = this.props.data;
			if(this.props.value && this.props.value !== "NA"){
				if(data.dailyCases < data.dailyCasesOld) {
				return <span>{this.props.value}<img src={downIcon} className="cell-icon"/></span>
			} else {
				return <span>{this.props.value}<img src={upIcon} className="cell-icon"/></span>
			}
		} else {return <span>-</span>}
	}

  render() {
    return (
      <span>
        {this.getValue()}
      </span>
    );
  }
}
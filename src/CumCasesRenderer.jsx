import React, { Component } from 'react';

export default class CumCasesRenderer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <span title={`Value shown for ${this.props.data.cumCasesDate}`}>
        {this.props.value}
      </span>
    );
  }
}
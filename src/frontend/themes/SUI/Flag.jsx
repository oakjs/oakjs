//////////////////////////////
//
//	<Flag> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";

export default class SUIFlag extends React.Component {
  static propTypes = {
    country: PropTypes.string
  };

  render() {
    const { country } = this.props;
    if (country) return <i className={`${country} flag`}/>;
  }
}

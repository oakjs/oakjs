//////////////////////////////
//
//	<Flag> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";

function SUIFlag(props) {
  const { country } = props;
  if (country) return <i className={`${country} flag`}/>;
}

SUIFlag.propTypes = {
  country: PropTypes.string
};


// add render() method so we get hot code reload.
SUIFlag.render = Function.prototype;

export default SUIFlag;

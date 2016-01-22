//////////////////////////////
//
//	<Flag> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";

export default function SUIFlag(props) {
  const { country } = props;
  if (country) return <i className={`${country} flag`}/>;
}
SUIFlag.propTypes = {
  country: PropTypes.string
};

//////////////////////////////
//
//	<Flag> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";

export default function Flag(props) {
  const { country } = props;
  if (country) return <i className={`${country} flag`}/>;
}
Flag.propTypes = {
  country: PropTypes.string
};

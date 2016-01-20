//////////////////////////////
//
//	<Icon> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";

export default function Icon(props) {
  const { icon } = props;
  if (icon) return <i className={`${icon} icon`}/>;
}
Icon.propTypes = {
  icon: PropTypes.string
};

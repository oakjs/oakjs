//////////////////////////////
//
//	<Icon> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";

export default function Icon({ icon } = {}) {
  if (icon) return <i className={`${icon} icon`}/>;
}
Icon.propTypes = {
  icon: PropTypes.string
};

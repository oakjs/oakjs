//////////////////////////////
//
//	<Icon> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

export default function Icon(props) {
  const { id, className, style, appearance, circular, icon } = props;
  const outerProps = {
    id,
    className: classNames(appearance, { circular }, icon, "icon"),
    style
  }
  return <i {...outerProps}/>
}

Icon.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,

  appearance: PropTypes.string,
  icon: PropTypes.string,
  circular: PropTypes.bool
};


// Method to render an icon iff we're passed one, otherwise returns `undefined`.
export function renderIcon(icon) {
  if (!icon) return undefined;
  return <Icon icon={icon}/>;
}

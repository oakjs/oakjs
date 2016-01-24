//////////////////////////////
//
//	<Icon> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

function SUIIcon(props) {
  const { id, className, style, appearance, circular, icon } = props;
  const iconProps = {
    id,
    className: classNames(appearance, { circular }, icon, "icon"),
    style
  }
  return <i {...iconProps}/>
}

SUIIcon.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,

  appearance: PropTypes.string,
  icon: PropTypes.string,
  circular: PropTypes.bool
};

// add render() method so we get hot code reload.
SUIIcon.render = Function.prototype;

export default SUIIcon;

// Method to render an icon iff we're passed one, otherwise returns `undefined`.
export function renderIcon(icon) {
  if (!icon) return undefined;
  return <SUIIcon icon={icon}/>;
}

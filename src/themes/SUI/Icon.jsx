//////////////////////////////
//
//  <Icon> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import { classNames } from "oak-roots/util/react";

function SUIIcon(props) {
  const {
    icon,
    // appearance
    className, appearance, circular, color,
    // everything else including id and style
    ...extraProps
  } = props;

  const iconProps = {
    className: classNames(appearance, { circular }, color, icon, "icon"),
    ...extraProps
  }
  return <i {...iconProps}/>
}

SUIIcon.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,

  appearance: PropTypes.string,
  icon: PropTypes.string,
  color: PropTypes.string,
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

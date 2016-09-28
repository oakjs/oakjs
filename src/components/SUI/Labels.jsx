//////////////////////////////
//
//  <Label> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import { classNames } from "oak-roots/util/react";

function SUILabels(props) {
  const {
    // allow for different tag names to be used (default is "div")
    tagName,
    // content
    children,
    // appearance
    className, appearance, color, size,
    // state & events
    hidden, disabled, active,
    // everything else including id and style
    ...groupProps
  } = props;

  // class name bits
  const classProps = {
    hidden,
    disabled,
  }

  groupProps.className = classNames(className, "ui", appearance, color, size, classProps, "labels");
  return React.createElement(tagName, groupProps, children);
}

SUILabels.defaultProps = {
  tagName: "div"
}

SUILabels.propTypes = {
  tagName: PropTypes.string,            // eg: "span" or "div"
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,

  appearance: PropTypes.string,
  color: PropTypes.string,              // `red`, etc
  size: PropTypes.string,               // `mini`, `tiny`, `small`, `medium`, `large`, `big`, `huge`, `massive`

  hidden: PropTypes.bool,
  disabled: PropTypes.bool,
};

// add render() method so we get hot code reload.
SUILabels.render = Function.prototype;

export default SUILabels;

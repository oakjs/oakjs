"use strict"
//////////////////////////////
//
//  <Side> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

function SUISide(props) {
  const {
    children,
    className, appearance, active,
    // includes id, style
    ...elementProps
  } = props;

  elementProps.className = classNames(className, { active }, appearance, "side");

  return React.createElement("div", elementProps, children);
}

SUISide.propTypes = {
  id: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,

  appearance: PropTypes.string,
  active: PropTypes.bool
};

// add render() method so we get hot code reload.
SUISide.render = Function.prototype;

export default SUISide;

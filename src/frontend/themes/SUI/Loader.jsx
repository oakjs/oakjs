//////////////////////////////
//
//	<Loader> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

function SUILoader(props) {
  const {
    // content
    text, children,
    // appearance
    className, appearance, size,
    // state & events
    hidden, disabled, active,
    // everything else including id, style, href, target
    ...loaderProps
  } = props;

  // class name bits
  const classProps = {
    hidden,
    disabled,
    active,
  }
  loaderProps.className = classNames(className, appearance, size, classProps, "loader");

  return React.createElement("div", loaderProps, text, children);
}

SUILoader.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,

  text: PropTypes.string,               //

  appearance: PropTypes.string,
  size: PropTypes.string,               // `mini`, `small`, `medium`, `large`

  hidden: PropTypes.bool,
  disabled: PropTypes.bool,
  active: PropTypes.bool,
};

// add render() method so we get hot code reload.
SUILoader.render = Function.prototype;

export default SUILoader;

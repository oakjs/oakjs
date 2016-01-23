"use strict"
//////////////////////////////
//
//  <Pusher> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

function SUIPusher(props) {
  const { id, className, style, appearance, children } = props;
  const pusherProps = {
    id,
    className: classNames(className, appearance, "pusher"),
    style,
  }
  return <div {...pusherProps}>{children}</div>;
}

SUIPusher.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  appearance: PropTypes.string,
};

// add render() method so we get hot code reload.
SUIPusher.render = Function.prototype;

export default SUIPusher;

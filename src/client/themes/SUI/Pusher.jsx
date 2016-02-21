"use strict"
//////////////////////////////
//
//  <Pusher> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "oak-roots/util/react";

function SUIPusher(props) {
  const { id, className, style, appearance, dimmed, children } = props;
  const pusherProps = {
    id,
    className: classNames(className, appearance, dimmed, "pusher"),
    style,
  }
  return <div {...pusherProps}>{children}</div>;
}

SUIPusher.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  appearance: PropTypes.string,
  dimmed: PropTypes.string,
};

// add render() method so we get hot code reload.
SUIPusher.render = Function.prototype;

export default SUIPusher;

"use strict"
//////////////////////////////
//
//  <Pusher> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

export default function SUIPusher(props) {
  const { id, className, style, appearance, children } = props;
  const outerProps = {
    id,
    className: classNames(className, appearance, "pusher"),
    style,
  }
  return <div {...outerProps}>{children}</div>;
}

SUIPusher.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  appearance: PropTypes.string,
};

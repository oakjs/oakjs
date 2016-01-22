"use strict"
//////////////////////////////
//
//  <Pusher> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

export default function Pusher(props) {
  const { id, className, style, appearance, children } = props;
  const outerProps = {
    id,
    className: classNames(className, appearance, "pusher"),
    style,
  }
  return <div {...outerProps}>{children}</div>;
}

Pusher.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  appearance: PropTypes.string,
};

"use strict";
//////////////////////////////
//	<Divider> component
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classNames";

export default function Divider({ key, className } = {}) {
  const props = {
    key,
    className: classNames("divider", className)
  };
  return <div {...props}/>;
}

Divider.PropTypes = {
  className: PropTypes.string
};

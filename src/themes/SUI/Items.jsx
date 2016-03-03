"use strict";
//////////////////////////////
//
//	<Items> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import { classNames } from "oak-roots/util/react";

import { getNameForNumber } from "./constants";

function SUIItems(props) {
  const {
    children,
    className, appearance, divided,
    // everything else, including id and style
    ...elementProps
  } = props;

  elementProps.className = classNames(className, "ui", appearance, { divided }, "items");
  return <div {...elementProps}>{children}</div>;
}

SUIItems.defaultProps = {}

SUIItems.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,

  appearance: PropTypes.string,   // "link"
  divided: PropTypes.bool,
};

// add render() method so we get hot code reload.
SUIItems.render = Function.prototype;

export default SUIItems;

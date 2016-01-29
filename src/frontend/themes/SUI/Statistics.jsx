"use strict";
//////////////////////////////
//
//	<Statistics> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

import ElementBuffer from "./ElementBuffer";
import { getNameForNumber } from "./constants";

function SUIStatistics(props) {
  const {
    children,
    appearance, size, columns,
    // includes id, className, style,
    ...otherProps
  } = props;

  const elements = new ElementBuffer({
    props: otherProps
  })
  elements.addClass("ui", getNameForNumber(columns), appearance, size, "statistics");
  elements.append(children);

  return elements.render();
}

SUIStatistics.defaultProps = {};

SUIStatistics.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,

  appearance: PropTypes.string,   // "collapsed", "threaded", "minimal"
  columns: PropTypes.number,      // # in a row
  size: PropTypes.string,

};

// add render() method so we get hot code reload.
SUIStatistics.render = Function.prototype;

export default SUIStatistics;

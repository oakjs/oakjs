"use strict"
//////////////////////////////
//
//  <Conditional> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "oak-roots/util/react";

function SUIConditional(props) {
  return <div className="or"/>
}

// add render() method so we get hot code reload.
SUIConditional.render = Function.prototype;

export default SUIConditional;

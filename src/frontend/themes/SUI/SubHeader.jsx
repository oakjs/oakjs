"use strict"
//////////////////////////////
//
//  <SubHeader> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

function SUISubHeader(props) {
  const { id, className, style, appearance, children } = props;
  const subHeaderProps = {
    id,
    // NOTE: this does NOT have "ui" in here, or we'll get ALL CAPS
    className: classNames(className, appearance, "sub header"),
    style,
  }
  return <div {...subHeaderProps}>{children}</div>;
}

SUISubHeader.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  appearance: PropTypes.string,
};

// add render() method so we get hot code reload.
SUISubHeader.render = Function.prototype;

export default SUISubHeader;

"use strict"
//////////////////////////////
//
//  <SubHeader> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

export default function SUISubHeader(props) {
  const { id, className, style, appearance, children } = props;
  const outerProps = {
    id,
    className: classNames(className, appearance, "sub header"),
    style,
  }
  return <div {...outerProps}>{children}</div>;
}

SUISubHeader.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  appearance: PropTypes.string,
};

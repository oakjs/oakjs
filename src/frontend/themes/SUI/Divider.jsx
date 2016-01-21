"use strict";
//////////////////////////////
//	<Divider> component
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

export default function Divider(props) {
  const { key, className, appearance, direction, style, header, icon, children } = props;

  const dividerProps = {
    key,
    className: classNames(className, "ui", appearance, direction, "divider"),
    style
  };

  const iconElment = (icon ? <Icon icon={icon}/> : undefined);
  if (header) {
    return <h4 {...dividerProps}>{iconElement}{header}{children}</h4>;
  }
  else {
    return <div {...dividerProps}>{iconElement}{header}{children}</div>;
  }
}

Divider.PropTypes = {
  key: PropTypes.any,
  className: PropTypes.string,
  appearance: PropTypes.string, // "inverted", "fitted", "hidden", "section", "clearing"
  direction: PropTypes.string,  // "vertical" or "horizontal"
  style: PropTypes.object,
  header: PropTypes.number,     // header text, will convert to an h4 if specified
  icon: PropTypes.string        // icon INSIDE the divider
};


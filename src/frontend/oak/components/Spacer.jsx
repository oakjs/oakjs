//////////////////////////////
//
//	<Spacer> component for use with SemanticUI
//
//  NOTE: this is not part of the standard SUI set!
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

import "./Spacer.css";

export default function OakSpacer(props) {
  const { className, appearance, size, inline, width, height } = props;

  const spacerProps = {
    className: classNames(className, "ui", size, appearance, "spacer"),
    inline,
    style: {
      width,
      height,
    }
  }
  if (inline) spacerProps.style.display = "inline-block";

  return <div {...spacerProps}/>;
}

OakSpacer.propTypes = {
  className: PropTypes.string,
  appearance: PropTypes.string,
  size: PropTypes.string,
  inline: PropTypes.bool,
  width: PropTypes.number,
  height: PropTypes.number
};

OakSpacer.defaultProps = {
  size: "medium"
}

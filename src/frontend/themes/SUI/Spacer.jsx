//////////////////////////////
//
//	<Spacer> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

export default function Spacer(props) {
  const { className, appearance, width, height, inline } = props;

  const spacerProps = {
    className: classNames("Spacer", className, appearance),
    style: {
      width,
      height,
    }
  }
  if (inline) spacerProps.style.display = "inline-block";

  return <div {...spacerProps}/>;
}

Spacer.propTypes = {
  className: PropTypes.string,
  appearance: PropTypes.string,
  inline: PropTypes.bool,
  width: PropTypes.number,
  height: PropTypes.number
};

Spacer.defaultProps = {
  width: 10,
  height: 10
}

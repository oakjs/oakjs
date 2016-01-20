//////////////////////////////
//
//	<Segment> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

import "./Segment.css";

export default function Segment(props) {
  const { id, className, appearance, clearing, style, children } = props;

  const segmentProps = {
    id,
    className: classNames(className, "ui", appearance, { clearing }, "segment"),
    style
  }
  return <div {...segmentProps}>{children}</div>;
}

Segment.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  appearance: PropTypes.string,
  clearing: PropTypes.bool,
  style: PropTypes.object,
};

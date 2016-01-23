//////////////////////////////
//
//	<Segment> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

import "./Segment.css";

function SUISegment(props) {
  const { id, className, appearance, clearing, style, children } = props;

  const segmentProps = {
    id,
    className: classNames(className, "ui", appearance, { clearing }, "segment"),
    style
  }
  return <div {...segmentProps}>{children}</div>;
}

SUISegment.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  appearance: PropTypes.string,   // `container`
  clearing: PropTypes.bool,
  style: PropTypes.object,
};

// add render() method so we get hot code reload.
SUISegment.render = Function.prototype;

export default SUISegment;

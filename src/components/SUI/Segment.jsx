//////////////////////////////
//
//  <Segment> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";

import ElementBuffer from "./ElementBuffer";
import "./Segment.css";

function SUISegment(props) {
  const {
    id, className, style,
    children,
    appearance, color, clearing, floated, align,
    visible, disabled, loading,
    ...extraProps
  } = props;

  const elements = new ElementBuffer({
    props : {
      ...extraProps,
      id,
      style,
      className: [className, "ui", color, appearance, { disabled, loading, clearing }, "segment"]
    }
  });
  if (!visible) elements.addClass("hidden");
  if (floated) elements.addClass(`${floated} floated`);
  if (align) elements.addClass(`${align} aligned`);

  elements.append(children);

  return elements.render();
}

SUISegment.defaultProps = {
  visible: true
}

SUISegment.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,

  appearance: PropTypes.string,   // "raised", "stacked", "tall stacked", "piled", "vertical", "container"
                                  // "unpadded", "padded", "very padded"
  color: PropTypes.string,        // "red", etc.
  align: PropTypes.string,        // "left", "center", "right"
  clearing: PropTypes.bool,

  visible: PropTypes.bool,
  disabled: PropTypes.bool,
  loading: PropTypes.bool
};

// add render() method so we get hot code reload.
SUISegment.render = Function.prototype;

export default SUISegment;

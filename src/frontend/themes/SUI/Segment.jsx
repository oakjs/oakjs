//////////////////////////////
//
//	<Segment> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

import "./Segment.css";

export default class SUISegment extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    appearance: PropTypes.string,   // `container`
    clearing: PropTypes.bool,
    style: PropTypes.object,
  };

  render() {
    const { id, className, appearance, clearing, style, children } = this.props;

    const props = {
      id,
      className: classNames(className, "ui", appearance, { clearing }, "segment"),
      style
    }
    return <div {...props}>{children}</div>;
  }
}

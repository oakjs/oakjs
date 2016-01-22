//////////////////////////////
//
//	<Rail> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

export default function Rail(props) {
  const { id, className, appearance, side, dividing, style, children } = props;

  const segmentProps = {
    id,
    className: classNames(className, "ui", appearance, side, classMap, "rail"),
    style
  }
  return <div {...segmentProps}>{children}</div>;
}

Rail.defaultProps = {
  side: "right"
}

Rail.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  appearance: PropTypes.string,   // `internal`, `dividing`, `attached`, `close`, `very close`
  side: PropTypes.string,         // `left` or `right`
  internal: PropTypes.bool,
  dividing: PropTypes.bool,
  style: PropTypes.object,
};

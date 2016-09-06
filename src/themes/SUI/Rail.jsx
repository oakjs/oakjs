//////////////////////////////
//
//  <Rail> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import { classNames } from "oak-roots/util/react";

function SUIRail(props) {
  const {
    children,
    left, right,
    className, appearance, internal, dividing,
    // including id, style
    ...elementProps
  } = props;

  elementProps.className = classNames(className, "ui", appearance, { left, right, internal, dividing }, "rail");
  return <div {...elementProps}>{children}</div>;
}

SUIRail.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,

  appearance: PropTypes.string,   // `internal`, `dividing`, `attached`, `close`, `very close`
  internal: PropTypes.bool,
  dividing: PropTypes.bool,
  left: PropTypes.bool,
  right: PropTypes.bool
};

// add render() method so we get hot code reload.
SUIRail.render = Function.prototype;

export default SUIRail;

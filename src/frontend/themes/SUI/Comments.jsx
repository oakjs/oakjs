"use strict";
//////////////////////////////
//
//	<Comments> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

import ElementBuffer from "./ElementBuffer";

function SUIComments(props) {
  const {
    header, headerAppearance, children,
    appearance,
    // includes id, className, style,
    ...otherProps
  } = props;

  const elements = new ElementBuffer({
    props: otherProps
  })
  elements.addClass("ui", appearance, "comments");

  if (header) {
    const headerClass = classNames("ui", headerAppearance, "header");
    elements.append(<div className={headerClass}>{header}</div>);
  }
  elements.append(children);

  return elements.render();
}

SUIComments.defaultProps = {
  headerAppearance: "dividing"
}

SUIComments.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,

  header: PropTypes.string,
  headerAppearance: PropTypes.string,

  appearance: PropTypes.string,   // "collapsed", "threaded", "minimal"

};

// add render() method so we get hot code reload.
SUIComments.render = Function.prototype;

export default SUIComments;

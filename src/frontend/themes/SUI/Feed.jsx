"use strict";
//////////////////////////////
//
//	<Feed> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

import ElementBuffer from "./ElementBuffer";

function SUIFeed(props) {
  const {
    header, headerAppearance, children,
    appearance, size,
    // includes id, className, style,
    ...otherProps
  } = props;

  const elements = new ElementBuffer({
    props: otherProps
  })
  elements.addClass("ui", appearance, size, "feed");

  if (header) {
    const headerClass = classNames("ui", headerAppearance, "header");
    elements.append(<div className={headerClass}>{header}</div>);
  }
  elements.append(children);

  return elements.render();
}

SUIFeed.defaultProps = {
  headerAppearance: "dividing"
}

SUIFeed.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,

  header: PropTypes.string,
  headerAppearance: PropTypes.string,

  appearance: PropTypes.string,   // "collapsed", "threaded", "minimal"
  size: PropTypes.string,

};

// add render() method so we get hot code reload.
SUIFeed.render = Function.prototype;

export default SUIFeed;

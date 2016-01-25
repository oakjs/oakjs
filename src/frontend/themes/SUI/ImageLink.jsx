//////////////////////////////
//
//	<ImageLink> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

import SUIImage, { getImageClassName } from "./Image";

function SUIImageLink(props, context) {
  // If disabled, don't make it a link
  if (props.disabled) return SUIImage(props, context);

  const { id, href, target, style, appearance, disabled, src } = props;
  const anchorProps = {
    id,
    className: getImageClassName(props),
    style,
    href,
    target,
  }
  return <a {...anchorProps}><img src={src}/></a>;
}

SUIImageLink.propTypes = Object.assign({}, SUIImage.propTypes, {
  href: PropTypes.string,
  target: PropTypes.target
});

// add render() method so we get hot code reload.
SUIImageLink.render = Function.prototype;

export default SUIImageLink;

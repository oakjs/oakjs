//////////////////////////////
//
//  <Ad> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";

import ElementBuffer from "./ElementBuffer";
import "./Ad.css";

function SUIAd(props) {
  const {
    children,
    hidden,
    appearance, size, test,
    // including id, className, style
    ...extraProps
  } = props;

  const elements = new ElementBuffer({
    props : extraProps
  });
  elements.addClass("ui", appearance, size, { hidden, test }, "ad");

  if (test) {
    elements.props["data-text"] = (typeof test === "string" ? test : size);
  }

  elements.append(children);
  return elements.render();
}

SUIAd.defaultProps = {}

SUIAd.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,

  test: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.string,
    ]),
  children: PropTypes.any,

  hidden: PropTypes.bool,

  appearance: PropTypes.string,
  size: PropTypes.string,
};

// add render() method so we get hot code reload.
SUIAd.render = Function.prototype;

export default SUIAd;

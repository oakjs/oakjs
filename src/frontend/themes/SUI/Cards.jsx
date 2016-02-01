"use strict";
//////////////////////////////
//
//	<Cards> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

import { getNameForNumber } from "./constants";

function SUICards(props) {
  const {
    children,
    appearance, count,
    ...elementProps
  } = props;

  elementProps.className = classNames(
                              elementProps.className, "ui", appearance,
                              getNameForNumber(count), "cards");
  return <div {...elementProps}>{children}</div>;
}

SUICards.defaultProps = {}

SUICards.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,

  appearance: PropTypes.string,   // "stackable", "tablet stackable"
  count: PropTypes.number,
};

// add render() method so we get hot code reload.
SUICards.render = Function.prototype;

export default SUICards;

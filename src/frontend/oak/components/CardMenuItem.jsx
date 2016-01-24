"use strict";
//////////////////////////////
//
//  <CardMenuItem>:  MenuItem which shows a card link.
//
//  TODO: if no slashes, stay in the current stack...
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

import Stub from "./Stub";

function OakCardMenuItem(props, context) {
  if (!props.card || !context.components) return <Stub/>;

  const c = context.components;
  const { card, label, children, ...otherProps } = props;

  const active = (context.card ? context.card.path === card.path : undefined);
  if (active) otherProps.className = classNames("active", otherProps.className);

  let linkText = (children || label || card.title);

  return (
    <c.MenuItem {...otherProps}>
      <c.Link card={card}>
        {linkText}
      </c.Link>
    </c.MenuItem>
  );
}

// Pull context in so we can get components from the card.
OakCardMenuItem.contextTypes = {
  components: PropTypes.any,
  card: PropTypes.any
};

// Add render function so we hot reload.
OakCardMenuItem.render = Function.prototype;

export default OakCardMenuItem;

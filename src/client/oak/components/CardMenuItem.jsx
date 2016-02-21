"use strict";
//////////////////////////////
//
//  <CardMenuItem>:  MenuItem which shows a card link.
//
//  TODO: if no slashes, stay in the current stack...
//
//////////////////////////////

import React, { PropTypes } from "react";
import { classNames } from "oak-roots/util/react";

import Stub from "./Stub";

function OakCardMenuItem(props, context) {
  if (!props.card || !context.components) return <Stub/>;

  const c = context.components;
  const { card, label, children, ...extraProps } = props;

  const active = (context.card ? context.card.path === card.path : undefined);
  if (active) extraProps.className = classNames("active", extraProps.className);

  let linkText = (children || label || card.title);

  return (
    <c.MenuItem {...extraProps}>
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

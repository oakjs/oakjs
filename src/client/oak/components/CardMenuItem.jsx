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

  const { card, label, children, ...extraProps } = props;
  const { MenuItem } = context.components;

  const active = (context.card ? context.card.path === card.path : undefined);
  extraProps.className = classNames("CardMenuItem", {active}, extraProps.className);

  const itemText = (children || label || card.title);
  const handleClick = () => app.goTo(card.route);

  return (
    <MenuItem {...extraProps} onClick={handleClick}>
      {itemText}
    </MenuItem>
  );
}

// Pull context in so we can get components from the card.
OakCardMenuItem.contextTypes = {
  components: PropTypes.any,
  card: PropTypes.any,
  router: PropTypes.any
};

// Add render function so we hot reload.
OakCardMenuItem.render = Function.prototype;

export default OakCardMenuItem;

"use strict";
//////////////////////////////
//
//  <PageMenuItem>:  MenuItem which shows a page link.
//
//  TODO: if no slashes, stay in the current section...
//
//////////////////////////////

import React, { PropTypes } from "react";
import { classNames } from "oak-roots/util/react";

import Stub from "./Stub";

function OakPageMenuItem(props, context) {
  if (!props.page || !context.components) return null;

  const { page, label, children, ...extraProps } = props;
  const { MenuItem } = context.components;

  const active = (context.page ? context.page.path === page.path : undefined);
  extraProps.className = classNames("PageMenuItem", {active}, extraProps.className);

  const itemText = (children || label || page.title);
  const handleClick = () => app.goTo(page.route);

  return (
    <MenuItem {...extraProps} onClick={handleClick}>
      {itemText}
    </MenuItem>
  );
}

// Pull context in so we can get components from the page.
OakPageMenuItem.contextTypes = {
  components: PropTypes.any,
  page: PropTypes.any,
  router: PropTypes.any
};

// Add render function so we hot reload.
OakPageMenuItem.render = Function.prototype;

export default OakPageMenuItem;

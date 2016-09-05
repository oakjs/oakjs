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

function PageMenuItem(props, context) {
  if (!props.page || !context.components) return null;

  const { page, label, children, ...extraProps } = props;
  const { SUI } = context.components;

  const active = (context.page ? context.page.path === page.path : undefined);
  extraProps.className = classNames("PageMenuItem", {active}, extraProps.className);

  const itemText = (children || label || page.title);
  const handleClick = () => oak.actions.navigateTo({ route: page.route });

  return (
    <SUI.MenuItem {...extraProps} onClick={handleClick}>
      {itemText}
    </SUI.MenuItem>
  );
}

// Pull context in so we can get components from the page.
PageMenuItem.contextTypes = {
  components: PropTypes.any,
  page: PropTypes.any,
  router: PropTypes.any
};

// Add render function so we hot reload.
PageMenuItem.render = Function.prototype;

export default PageMenuItem;

// Oak editor prefs
import { editify } from "../EditorProps";
editify({ draggable: true, droppable: false }, PageMenuItem);

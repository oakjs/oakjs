"use strict";
//////////////////////////////
//
//  <SectionMenuItem>:  MenuItem which shows a page link.
//
//  TODO: if no slashes, stay in the current section...
//
//////////////////////////////

import React, { PropTypes } from "react";
import { classNames } from "oak-roots/util/react";

function SectionMenuItem(props, context) {
  if (!props.section || !context.components) return null;

  const { section, label, children, checkSelected, ...menuProps } = props;
  const { SUI } = context.components;

  menuProps.className = classNames("SectionMenuItem", {active}, menuProps.className);
  menuProps.onClick = () => oak.actions.navigateTo({ route: section.route });

  const active = (context.section ? context.section.path === section.path : undefined);
  if (checkSelected) menuProps.icon = (active ? "checkmark" : "none");
  else if (active) menuProps.className += " active";

  const itemText = (children || label || section.title);
  return (
    <SUI.MenuItem {...menuProps}>
      {itemText}
    </SUI.MenuItem>
  );
}

// Pull context in so we can get components from the page.
SectionMenuItem.contextTypes = {
  components: PropTypes.any,
  section: PropTypes.any,
  router: PropTypes.any
};

// Add render function so we hot reload.
SectionMenuItem.render = Function.prototype;

export default SectionMenuItem;

// Oak editor prefs
import { editify } from "../EditorProps";
editify({ draggable: true, droppable: false }, SectionMenuItem);

"use strict";
//////////////////////////////
//
//  <ProjectMenuItem>:  MenuItem which shows a page link.
//
//  TODO: if no slashes, stay in the current section...
//
//////////////////////////////

import React, { PropTypes } from "react";
import { classNames } from "oak-roots/util/react";

function ProjectMenuItem(props, context) {
  if (!props.project || !context.components) return null;

  const { project, label, children, checkSelected, ...menuProps } = props;
  const { SUI } = context.components;

  menuProps.className = classNames("ProjectMenuItem", {active}, menuProps.className);
  menuProps.onClick = () => oak.actions.navigateTo({ route: project.route });

  const active = (context.project ? context.project.path === project.path : undefined);
  if (checkSelected) menuProps.icon = (active ? "checkmark" : "none");
  else if (active) menuProps.className += " active";

  const itemText = (children || label || project.title);
  return (
    <SUI.MenuItem {...menuProps}>
      {itemText}
    </SUI.MenuItem>
  );
}

// Pull context in so we can get components from the page.
ProjectMenuItem.contextTypes = {
  components: PropTypes.any,
  project: PropTypes.any,
  router: PropTypes.any
};

// Add render function so we hot reload.
ProjectMenuItem.render = Function.prototype;

export default ProjectMenuItem;

// Oak editor prefs
import { editify } from "../EditorProps";
editify({ draggable: true, droppable: false }, ProjectMenuItem);

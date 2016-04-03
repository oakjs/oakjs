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

import Stub from "./Stub";

function ProjectMenuItem(props, context) {
  if (!props.project || !context.components) return null;

  const { project, label, children, ...extraProps } = props;
  const { MenuItem } = context.components;

  const active = (context.project ? context.project.path === project.path : undefined);
  extraProps.className = classNames("ProjectMenuItem", {active}, extraProps.className);

  const itemText = (children || label || project.title);
  const handleClick = () => oak.goTo(project.route);

  return (
    <MenuItem {...extraProps} onClick={handleClick}>
      {itemText}
    </MenuItem>
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

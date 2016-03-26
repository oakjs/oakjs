// Menu of pages in the current section.
import React, { PropTypes } from "react";
import { classNames } from "oak-roots/util/react";

function ProjectMenu(props, context) {
  const { app, components: c } = context;

  // pass all other props along
  const menuProps = Object.assign({}, props);
  menuProps.className = classNames("ProjectMenu", props.className);

  const menuItems = app.projects
                      .filter(project => !project.isPrivate)
                      .map(project => <c.ProjectMenuItem key={project.path} project={project}/>);
  return React.createElement(c.Menu, menuProps, menuItems);
}

// Pull context in so we can get components and pointer to the current section.
ProjectMenu.contextTypes = {
  app: PropTypes.any,
  components: PropTypes.any,
  section: PropTypes.any
};

// Add render function so we hot reload.
ProjectMenu.render = Function.prototype;

export default ProjectMenu;

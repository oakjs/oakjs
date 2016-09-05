// Menu of pages in the current section.
import React, { PropTypes } from "react";
import { classNames } from "oak-roots/util/react";

function ProjectMenu(props, context) {
  const { oak } = context;
  const { SUI } = context.components;

  // pass all other props along
  const menuProps = Object.assign({}, props);
  menuProps.className = classNames("ProjectMenu", props.className);

  const menuItems = oak.projects
                      .filter(project => !project.isPrivate)
                      .map(project => <SUI.ProjectMenuItem key={project.path} project={project}/>);
  return React.createElement(SUI.Menu, menuProps, menuItems);
}

// Pull context in so we can get components and pointer to the current section.
ProjectMenu.contextTypes = {
  oak: PropTypes.any,
  components: PropTypes.any,
  section: PropTypes.any
};

export default ProjectMenu;

// Oak editor prefs
import { editify } from "../EditorProps";
editify({ draggable: true, droppable: true }, ProjectMenu);

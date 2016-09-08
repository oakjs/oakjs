// Menu of pages in the current section.
import React, { PropTypes } from "react";
import { classNames } from "oak-roots/util/react";

function SectionMenu(props, context) {
  const { Oak, SUI } = context.components;

  const project = props.project || context.project;
  if (!SUI || !project || !project.isLoaded) return null;

  // pass all props along to menu
  const menuProps = Object.assign({}, props);
  menuProps.className = classNames("SectionMenu", props.className);

  const menuItems = sections
                      .filter(section => !section.isPrivate)
                      .map(section => <Oak.SectionMenuItem key={section.path} section={section}/>);
  return React.createElement(SUI.Menu, menuProps, menuItems);
}

// Pull context in so we can get components and pointer to the current section.
SectionMenu.contextTypes = {
  components: PropTypes.any,
  section: PropTypes.any
};

export default SectionMenu;

// Oak editor prefs
import { editify } from "../EditorProps";
editify({ draggable: true, droppable: true }, SectionMenu);

// Menu of pages in the current section.
import React, { PropTypes } from "react";
import { classNames } from "oak-roots/util/react";

function PageMenu(props, context) {
  const { Oak, SUI } = context.components;
  const section = props.section || context.section;
  if (!SUI || !section || !section.isLoaded) return false;

  // pass all other props along
  const menuProps = Object.assign({}, props);
  menuProps.className = classNames("PageMenu", props.className);

  const menuItems = section.pages.map(page => <Oak.PageMenuItem key={page.path} page={page}/>);
  return React.createElement(SUI.Menu, menuProps, menuItems);
}

// Pull context in so we can get components and pointer to the current section.
PageMenu.contextTypes = {
  components: PropTypes.any,
  section: PropTypes.any
};

// Add render function so we hot reload.
PageMenu.render = Function.prototype;

export default PageMenu;


// Oak editor prefs
import { editify } from "../EditorProps";
editify({ draggable: true, droppable: true }, PageMenu);

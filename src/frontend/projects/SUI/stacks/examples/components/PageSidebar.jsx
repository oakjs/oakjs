import React, { PropTypes } from "react";

function PageSidebar(props, context) {
  const { CardLink, Menu, MenuHeader, MenuItem, Sidebar } = context.stack.components;
  return (
    <Sidebar visible appearance="inverted vertical sticky menu">
      <MenuHeader>Components</MenuHeader>
      <Menu>
        <MenuItem><CardLink to="SUI/examples/Button">Button</CardLink></MenuItem>
        <MenuItem><CardLink to="SUI/examples/ButtonGroup">ButtonGroup</CardLink></MenuItem>
      </Menu>
    </Sidebar>
  );
}

// Pull context in so we can get components from the stack.
PageSidebar.contextTypes = {
  project: PropTypes.any,
  stack: PropTypes.any,
  card: PropTypes.any
};

// Add `render` method so we'll get hot reload
PageSidebar.render = Function.prototype;

export default PageSidebar;

import React from "react";

// load theme/oak components
// TODO: pick these up from stack.components via context?
import * as themeComponents from "themes/SUI/";
import * as oakComponents from "oak/components";
const components = Object.assign(themeComponents, oakComponents);

export default function PageSidebar(props) {
  const { CardLink, Menu, MenuHeader, MenuItem, Sidebar } = components;
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

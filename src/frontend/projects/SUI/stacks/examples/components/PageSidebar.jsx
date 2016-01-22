import React from "react";

// load project components
import components from "../../../components/";

export default function PageSidebar(props) {
  const { CardLink, Menu, MenuHeader, MenuItem, Sidebar } = components;
  return (
    <Sidebar visible appearance="inverted vertical sticky menu">
      <MenuHeader>Components</MenuHeader>
      <Menu>
        <MenuItem><CardLink to="SUI/examples/Button">Button</CardLink></MenuItem>
        <MenuItem><CardLink to="SUI/examples/ButtonGroup">ButtonGroup</CardLink></MenuItem>
        <MenuItem><CardLink to="SUI/examples/Dropdown">Dropdown</CardLink></MenuItem>
      </Menu>
    </Sidebar>
  );
}

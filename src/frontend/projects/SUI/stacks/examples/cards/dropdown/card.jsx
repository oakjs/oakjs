"use strict";
import React from "react";
import oak, { Card } from "../../../../../../oak";

// just use project components
import components from "../../../../components";

export default class DropdownCard extends Card {
	static defaultProps = {
		id: "dropdown",
		title: "<Dropdown> Examples"
	};

  // Remember imported components
  static components = components;

  renderChildren() {
    const { Container, Dropdown, Menu, MenuItem } = this.components;
    return (
      <Container>
        <h1>Dropdown Tests</h1>
        <Dropdown placeholder="Foo" appearance="button" selectable multiSelect icon="heart" showArrow={true}>
          <Menu>
            <MenuItem label="Yah"/>
            <MenuItem label="Hoo"/>
          </Menu>
        </Dropdown>
      </Container>
    );
  }
}

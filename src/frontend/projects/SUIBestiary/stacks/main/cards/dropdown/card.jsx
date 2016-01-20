"use strict";
import React from "react";
import { default as oak } from "../../../../../../oak";

// just use project components
import { default as components } from "../../../../components";

export default class Dropdown extends oak.Card {
	static defaultProps = {
	  id: "DSA1234ja7as",
		name: "dropdown",
		title: "<Dropdown> Examples"
	};

  static components = components;

  renderChildren() {
    const { Dropdown, Menu, MenuItem } = this.components;
    return (<div>
      <h1>Dropdown Tests</h1>
      <Dropdown placeholder="Foo" appearance="button" selectable multiSelect icon="heart" showArrow={true}>
        <Menu>
          <MenuItem label="Yah"/>
          <MenuItem label="Hoo"/>
        </Menu>
      </Dropdown>
    </div>);
  }
}

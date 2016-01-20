"use strict";
import React from "react";
import { default as oak } from "../../../../../../oak";

// just use project components
import { default as components } from "../../../../../../components";

export default class Dropdown extends oak.Card {
	static defaultProps = {
	  id: "DSA1234ja7as",
		name: "dropdown",
		title: "<Dropdown> Examples"
	};

  renderChildren() {
    return (
      <div>Show dropdowns!!!</div>
    );
  }
}

"use strict";
import React from "react";
import StackComponent from "oak/StackComponent";

import * as components from "./components";
import * as cardMap from "./cards";

import "./stack.css";

export default class TestStack extends StackComponent {
  // Pull imports into scope
	static _components = components;
	static cardMap = cardMap;

  // Necessary so hot reloader will notice this file.
  render(){ return super.render() }

	static defaultProps = {
		id: "test",
		title: "Test"
	};

}

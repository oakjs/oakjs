"use strict";
import React from "react";
import oak from "oak";

import * as components from "./components";
import * as cardMap from "./cards";

import "./stack.css";

export default class Stack extends oak.Stack {
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

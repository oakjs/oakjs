"use strict";

import React from "react";
import Project from "oak/Project";

import * as themeComponents from "./theme";
import * as projectComponents from "./components";
import * as stackMap from "./stacks";

export default class TestProject extends Project {
	static themeComponents = themeComponents;
	static projectComponents = projectComponents;
	static stackMap = stackMap;

	static defaultProps = {
		id: "test",
		title: "Test"
	};
  // Necessary so hot reloader will notice this file.
  render(){ return super.render() }
}

//TestProject.initialize();


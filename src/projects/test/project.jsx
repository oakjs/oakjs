"use strict";

import React from "react";
import ProjectComponent from "oak/ProjectComponent";

import * as themeComponents from "./theme";
import * as projectComponents from "./components";
import * as stackMap from "./stacks";

export default class TestProject extends ProjectComponent {
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


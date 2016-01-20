"use strict";

import React from "react";
import oak, { Project } from "oak";

import components from "./components";
import constructors from "./stacks/index";

export default class SUIProject extends Project {
	static defaultProps = {
		id: "SUI",
		title: "Semantic UI"
	};

	// Remember constructors and components.
	static stackConstructors = constructors;
	static components = components;
}


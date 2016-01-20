"use strict";

import React from "react";
import oak, { Stack } from "oak";

import constructors from "./cards/index.js";
// just use project components
import components from "projects/SUI/components";


export default class ExamplesStack extends Stack {
	static defaultProps = {
		id: "Examples",
		title: "Examples"
	};

	// Remember constructors and components.
	static cardConstructors = constructors;
	static components = components;
}

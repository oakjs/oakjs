"use strict";

import React from "react";
import { default as oak } from "../../oak";

import { default as components } from "./components";
import { default as constructors } from "./stacks/index";

export default class SUIProject extends oak.Project {
	static defaultProps = {
		id: "ASDJK123m1231",
		name: "SUIBestiary",
		title: "SUI Bestiary"
	};

	// Remember constructors and components.
	static stackConstructors = constructors;
	static components = components;
}


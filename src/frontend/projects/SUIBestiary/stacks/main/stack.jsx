"use strict";

import React from "react";
import { default as oak } from "../../../../oak";

import { default as constructors } from "./cards/index.js";
// just use project components
import { default as components } from "../../../../components";


export default class MainStack extends oak.Stack {
	static defaultProps = {
	  id: "DSA1234ja7as",
		name: "main",
		title: "Components"
	};

	// Remember constructors and components.
	static cardConstructors = constructors;
	static components = components;
}

"use strict";

import React from "react";
import oak, { Project } from "oak";

export default class SUIProject extends Project {
	static defaultProps = {
		id: "SUI",
		title: "Semantic UI"
	};
  // Necessary so hot reloader will notice this file.
  render(){ return super.render() }
}


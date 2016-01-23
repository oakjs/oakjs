"use strict";

import React from "react";
import oak, { Stack } from "oak";

export default class ExamplesStack extends Stack {
	static defaultProps = {
		id: "examples",
		title: "Examples"
	};
  // Necessary so hot reloader will notice this file.
  render(){ return super.render() }
}

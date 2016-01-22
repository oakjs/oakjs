import React, { PropTypes } from "react";
import { Route, IndexRoute } from "react-router";
import classNames from "classnames";

import Stack from "./Stack";
import * as oakComponents from "oak/components";

// Project-specific CSS styling.
import "./Project.css";

export default class OakProject extends React.Component {
  // Ordered list of stack constructors.
  // NOTE: your subclass MUST assign this when defining your class.
  static stackConstructors = [];

  // Initialize a single Project, including bits we can only get by `import`ing.
  // NOTE: also sets up stacks and cards!
  static initializeProject({ project, themeComponents, projectComponents, stackMap }) {
    // reflection
    project.id = project.defaultProps.id;
    project.title = project.defaultProps.title;
    project.path = project.id;

    // Merge themeComponents, oakComponents and projectComponents
    // NOTE: MUST happen BEFORE initializing stacks.
    project.components = Object.assign({}, themeComponents, oakComponents, projectComponents);

    // Initialize stack indexes
    project.stackMap = stackMap;
    const stackIds = project.stackIds = Object.keys(stackMap);
    const stacks = project.stacks = stackIds.map(stackId => stackMap[stackId]);

    // Initialize stacks.
    stacks.forEach((stack, stackIndex) => Stack.initializeStack({ project, stack, stackIndex }));

    // Set up project routing.
    // NOTE: MUST happen AFTER initializing stacks.
    const stackRoutes = [
      // TODO: indexRoute???
      ...stacks.map(stack => stack.route)
    ]
    project.route = React.createElement(Route, { path: project.id, component: project }, ...stackRoutes);

console.group("project after indexing:");
console.dir(project);
console.groupEnd();

    return project;
  }


  //////////////////////////////
  // Syntactic sugar
  //////////////////////////////

  // Return the stackConstructors defined on our constructor.
  get stackConstructors() {
    return this.constructor.stackConstructors;
  }

  // Return a pointer to a stack constructor given an `stackName`.
  // NOTE: this assumes `class.stackConstructors` is set up when project
  getStackConstructor(stackName = this.state.stack) {
    if (!stackName) return undefined;
    return this.stackConstructors.filter(constructor => constructor.name === stackName)[0];
  }

  //////////////////////////////
  // Rendering
  //////////////////////////////

  renderStack() {
    // If we were passed a child element by the router, just return that.
    const { children } = this.props;
    if (children) return children;

    // Otherwise create an instance of the first of our `stackConstructors`.
    const StackConstructor = this.stackConstructors[0];
    if (!StackConstructor) throw new TypeError("stack.renderStack(): no stackConstructors defined.");
    return <StackConstructor/>;
  }

  render() {
    const { id, className, style } = this.props;
    const props = {
      id,
      className: classNames("oak Project", className),
      style
    }
    return <div {...props}>{this.renderStack()}</div>;
  }
}

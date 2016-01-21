import React, { PropTypes } from "react";
import classNames from "classnames";

import OakComponent from "./OakComponent";

export default class Project extends OakComponent {
  // Project-specific `propTypes`.
  static propTypes = Object.assign({}, OakComponent.propTypes, {});

  // Project-specific `defaultProps`.
  static defaultProps = Object.assign({}, OakComponent.defaultProps, {});

  // Project-specific `stateTypes`.
  static stateTypes = Object.assign({}, OakComponent.stateTypes, {});

  // Ordered list of stack constructors.
  // NOTE: your subclass MUST assign this when defining your class.
  static stackConstructors = [];


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

  // Tack `Project` on the beginning of our css class name.
  renderClassName() {
    return classNames("Project", super.renderClassName());
  }

  renderChildren() {
    const { children } = this.props;
    if (children) return children;

    const Stack = this.stackConstructors[0];
    if (Stack) return <Stack/>;

    throw new TypeError("project.renderChildren(): can't find a stack to render.");
  }

}

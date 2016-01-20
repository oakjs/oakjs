import React, { PropTypes } from "react";
import OakComponent from "./OakComponent";

export default class Project extends OakComponent {
  // Project-specific `propTypes`.
  static propTypes = Object.assign({}, OakComponent.propTypes, {});

  // Project-specific `defaultProps`.
  static defaultProps = Object.assign({}, OakComponent.defaultProps, {});

  // Project-specific `stateTypes`.
  static stateTypes = Object.assign({}, OakComponent.stateTypes, {
    // `name` of the currently displayed stack.
    stack: PropTypes.string
  });

  // Ordered list of stack constructors.
  // NOTE: your subclass MUST assign this when defining your class.
  static stackConstructors = [];

  constructor() {
    super(...arguments);
    // initialize default stack
    // NOTE: this assumes that we have some stackConstructors!
    const defaultStack = this.stackConstructors[0];
    if (!defaultStack) throw TypeError("Project has no stackConstructors!  Define them in your project.jsx file.");

    // Initialize with the name of the default stack.
    this.state = {
      stack: defaultStack.name
    };
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

  // Tack `Project` on the beginning of our css class name.
  renderClassName() {
    const className = super.renderClassName();
    return `Project ${className}`;
  }


  renderChildren() {
    const Stack = this.getStackConstructor();
    return <Stack project={this}/>;
  }

}

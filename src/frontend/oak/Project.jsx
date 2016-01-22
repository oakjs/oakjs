import React, { PropTypes } from "react";
import classNames from "classnames";

import "./Project.css";

class Project extends React.Component {
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

export default Project;

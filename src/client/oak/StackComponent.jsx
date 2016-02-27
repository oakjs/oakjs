import React, { PropTypes } from "react";
import { classNames } from "oak-roots/util/react";

import OakComponent from "./OakComponent";
import Stub from "./components/Stub";

// Import custom CSS for all stacks.
import "./Stack.css";

export default class StackComponent extends OakComponent {
  static propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
  }

  //////////////////////////////
  // Instance property sugar
  //////////////////////////////

  get controller() { return this.constructor.controller }

  get app() { return this.controller.app }
  get id() { return this.controller.id }
  get project() { return this.controller.project }
  get type() { return this.controller.type; }

  static get route() { return this.controller.route }

  //////////////////////////////
  // Components
  //////////////////////////////

  // Create an element, using our `components` if necessary.
  createElement(type, props, ...children) {
    const component = this.controller.getComponent(type, "Can't find stack component") || Stub;
    return React.createElement(component, props, ...children);
  }

  //////////////////////////////
  // Rendering
  //////////////////////////////

  render() {
    const { id, className, style } = this.props;
    const props = {
      id,
      className: classNames("oak Stack", className),
      style
    }
    return <div {...props}>{this.props.children}</div>;
  }

}

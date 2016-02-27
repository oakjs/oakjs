import React, { PropTypes } from "react";
import { classNames } from "oak-roots/util/react";

import OakComponent from "./OakComponent";

// Project-specific CSS styling.
import "./Project.css";

export default class ProjectComponent extends OakComponent {
  static defaultProps = {}

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
  get type() { return this.controller.type; }

  static get route() { return this.controller.route }

  //////////////////////////////
  // Components
  //////////////////////////////

  // Create an element, using our `components` if necessary.
  createElement(type, props, ...children) {
    const component = this.controller.getComponent(type, "Can't find project component") || Stub;
    return React.createElement(component, props, ...children);
  }

  //////////////////////////////
  // Rendering
  //////////////////////////////

  get render() {
    const { id, className, style } = this.props;
    const props = {
      id,
      className: classNames("oak Project", className),
      style
    }
    return <div {...props}>{this.props.children}</div>;
  }
}

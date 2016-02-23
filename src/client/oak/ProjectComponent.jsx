import React, { PropTypes } from "react";
import { classNames } from "oak-roots/util/react";

// Project-specific CSS styling.
import "./Project.css";

export default class ProjectComponent extends React.Component {
  static defaultProps = {}

  static propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
  }

  static childContextTypes = {
    project: PropTypes.any,
    components: PropTypes.any
  };

  getChildContext() {
    return { project: this, components: this.components };
  }


  static get stackIds() { return this.controller && this.controller.stackIds }
  static get route() { return "/projects/" + this.id }

  //////////////////////////////
  // Instance property sugar
  //////////////////////////////

  get id() { return this.constructor.id }
  get controller() { return this.constructor.controller }
  get app() { return this.constructor.app }

  //////////////////////////////
  // Components
  //////////////////////////////

  get components() { return this.controller.components }

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
      className: classNames("oak Stack", className),
      style
    }
    return <div {...props}>{this.props.children}</div>;
  }
}

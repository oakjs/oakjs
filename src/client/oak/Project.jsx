import React, { PropTypes } from "react";
import { Route, IndexRoute } from "react-router";
import { classNames } from "oak-roots/util/react";

// Project-specific CSS styling.
import "./Project.css";

export default class OakProject extends React.Component {
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

  //////////////////////////////
  // Components
  //////////////////////////////

  // TODO: dynamic project components
  createElement(type, props, ...children) {
    const component = this.app.getComponent(this.controller, type, "Can't find project component");
    return React.createElement(component, props, ...children);
  }

  //////////////////////////////
  // Syntactic sugar for deriving stuff
  //////////////////////////////
  static get stackIds() { return this.controller && this.controller.stackIds }
  static get id() { return this.controller && this.controller.id }
  static get title() { return this.controller && this.controller.title }
  static get path() { return "/projects/" + this.id }

  //////////////////////////////
  // Syntactic sugar for treating static things like instance things.
  //////////////////////////////

  // Return the stack / component CONSTRUCTORS (NOT instances).
  // (Really only useful for calling static methods).
  get components() { return this.constructor.components }

  // Reflection
  get id() { return this.constructor.id }
  get title() { return this.constructor.title }
  get path() { return this.constructor.path }



  //////////////////////////////
  // Rendering
  //////////////////////////////

  get renderProps() {
    const { id, className, style } = this.props;
    return {
      id,
      className: classNames("oak Project", className),
      style
    }
  }

  render() {
    return <div {...this.renderProps}>{this.props.children}</div>;
  }
}

import React, { PropTypes } from "react";
import { classNames } from "oak-roots/util/react";

// Import custom CSS for all stacks.
import "./Stack.css";

export default class StackComponent extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
  }

  static contextTypes = {
    app: PropTypes.any,
    project: PropTypes.any
  }

  static childContextTypes = {
    stack: PropTypes.any,
    components: PropTypes.any
  };

  getChildContext() {
    return { stack: this, components: this.components };
  }


  static get cardIds() { return this.controller && this.controller.cardIds }
  static get route() { return this.app.getCardRoute(this.project.id, this.id) }

  //////////////////////////////
  // Instance property sugar
  //////////////////////////////

  get id() { return this.constructor.id }
  get controller() { return this.constructor.controller }
  get app() { return this.constructor.app }
  get project() { return this.constructor.project }

  get cardMap() { return this.controller.cardMap }

  //////////////////////////////
  // Components
  //////////////////////////////

  get components() { return this.controller.components }

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

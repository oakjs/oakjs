import React, { PropTypes } from "react";
import { Route } from "react-router";

import { autobind } from "oak-roots/util/decorators";
import { classNames } from "oak-roots/util/react";

import { getPath, setPath } from "./path";

// Import custom CSS for all cards.
import "./Card.css";

export default class OakCard extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
  }

  static contextTypes = {
    project: PropTypes.any,
    stack: PropTypes.any,
  }

  static childContextTypes = {
    card: PropTypes.any,
    components: PropTypes.any
  };

  getChildContext() {
    return { card: this, components: this.components };
  }

  //////////////////////////////
  // Instance property sugar
  //////////////////////////////

  get id() { return this.constructor.id }
  get controller() { return this.constructor.controller }
  get app() { return this.constructor.app }
  get project() { return this.constructor.project }
  get stack() { return this.constructor.stack }

  //////////////////////////////
  // Components
  //////////////////////////////

  get components() { return this.controller.components }

  // Create an element, using our `components` if necessary.
  createElement(type, props, ...children) {
    const component = this.controller.getComponent(type, "Can't find card component") || Stub;
    return React.createElement(component, props, ...children);
  }


  //////////////////////////////
  // Constructor / initial state stuff
  //////////////////////////////

  constructor() {
    super(...arguments);

    this.state = {};
    this.data = this.getInitialData(this.getChildContext());
  }

  // Return `data` for your card, which will be stored in `card.state.data`.
  // NOTE: this should always return a new object,
  //  as data may get modified when the card is in use.
  getInitialData() {
    return {};
  }

  // Get a `possibly.dotted.path` value from `card.data`.
  // Returns `defaultValue` if resulting value is `undefined`.
  // NOTE: If you're looking for a top-level value (eg: `path` === `"a"`),
  //        you can safely access data directly, (eg: just do `card.data.a`).
  @autobind
  get(path, defaultValue) {
    const value = getPath(this.data, path);
    if (value === undefined) return defaultValue;
    return value;
  }

  @autobind
  // Set a `possibly.dotted.path` value on `card.data`.
  // Will create objects along the path as necessary.
  // Returns the modified data object.
  set(path, value) {
    // Don't update if value hasn't actually change
    const currentValue = this.get(path);
    if (value === currentValue) return;

    setPath(this.data, path, value);
    this.forceUpdate();
    return this.data;
  }

  @autobind
  // Return a function which will set some `possibly.dotted.path` data on this card.
  deferredSet(path, value) {
    return () => {
      this.set(path, value);
    }
  }

  //////////////////////////////
  // Rendering
  //////////////////////////////

  render() {
    const { id, className, style } = this.props;
    const props = {
      id,
      className: classNames("oak Card", className),
      style
    }
    return <div {...props}>{this.props.children}</div>;
  }

}

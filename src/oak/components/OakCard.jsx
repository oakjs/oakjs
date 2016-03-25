import React, { PropTypes } from "react";

import { autobind } from "oak-roots/util/decorators";
import { getPath, setPath } from "oak-roots/util/path";
import { classNames, unknownProperties } from "oak-roots/util/react";

import OakComponent from "./OakComponent";

// Import custom CSS for all cards.
import "./OakCard.css";

export default class OakCard extends OakComponent {
  static propTypes = {
    ...OakComponent.propTypes,
    title: PropTypes.string,
  }

  static get route() { return this.app.getCardRoute(this.project.id, this.section.id, this.id) }

  //////////////////////////////
  // Instance property sugar
  //////////////////////////////

  get controller() { return this.constructor.controller }

  get app() { return this.controller.app }
  get id() { return this.controller.id }
  get project() { return this.controller.project }
  get section() { return this.controller.section }
  get type() { return this.controller.type; }

// DEPRECATED?
  static get route() { return this.controller.route }

  //////////////////////////////
  // Constructor / initial state stuff
  //////////////////////////////

  constructor() {
    super(...arguments);

    this.state = {};
    this.data = this.getInitialData(this.context);
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
    const value = getPath(path, this.data);
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

    setPath(value, path, this.data);
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

  getClassName() {
    return classNames("oak Card", this.props.className);
  }

}

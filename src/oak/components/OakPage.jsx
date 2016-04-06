import React, { PropTypes } from "react";

import { autobind } from "oak-roots/util/decorators";
import { getPath, setPath } from "oak-roots/util/path";
import { classNames, unknownProperties } from "oak-roots/util/react";

import OakComponent from "./OakComponent";

// Import custom CSS for all pages.
import "./OakPage.css";

export default class OakPage extends OakComponent {
  static propTypes = {
    ...OakComponent.propTypes,
    title: PropTypes.string,
  }

  static get route() { return this.oak.getPageRoute(this.project.id, this.section.id, this.id) }

  //////////////////////////////
  // Instance property sugar
  //////////////////////////////

  get controller() { return this.constructor.controller }

  get oak() { return this.controller.oak }
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

//TODO: data should come from controller ????
    this.state = {};
    this.data = this.getInitialData(this.context);
  }

  // Return `data` for your page, which will be stored in `page.state.data`.
  // NOTE: this should always return a new object,
  //  as data may get modified when the page is in use.
  getInitialData() {
    return {};
  }

  // Get a `possibly.dotted.path` value from `page.data`.
  // Returns `defaultValue` if resulting value is `undefined`.
  // NOTE: If you're looking for a top-level value (eg: `path` === `"a"`),
  //        you can safely access data directly, (eg: just do `page.data.a`).
  @autobind
  get(path, defaultValue) {
    const value = getPath(path, this.data);
    if (value === undefined) return defaultValue;
    return value;
  }

  @autobind
  // Set a `possibly.dotted.path` value on `page.data`.
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
  // Return a function which will set some `possibly.dotted.path` data on this page.
  deferredSet(path, value) {
    return () => {
      this.set(path, value);
    }
  }

  //////////////////////////////
  // Rendering
  //////////////////////////////

  getClassName() {
    return classNames("oak", this.props.className, "Page");
  }

}

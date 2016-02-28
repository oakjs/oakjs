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
  // Rendering
  //////////////////////////////

  getClassName(props) {
    return classNames("oak Project", props.className)
  }
}

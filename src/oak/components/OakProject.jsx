import React, { PropTypes } from "react";
import { classNames } from "oak-roots/util/react";

import OakComponent from "./OakComponent";

// Project-specific CSS styling.
import "./OakProject.css";

export default class OakProject extends OakComponent {
//  static defaultProps = {}

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

  get id() { return this.controller.id }
  get type() { return this.controller.type; }

// DEPRECATED ???
  static get route() { return this.controller.route }

  //////////////////////////////
  // Rendering
  //////////////////////////////

  getClassName(props) {
    return classNames("oak", this.props.className, "Project");
  }
}

// Oak editor prefs
import { editify } from "../EditorProps";
editify({ draggable: false, droppable: true }, OakProject);

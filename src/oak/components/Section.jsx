import React, { PropTypes } from "react";
import { classNames } from "oak-roots/util/react";

import OakComponent from "./OakComponent";

import "./Section.less";

export default class Section extends OakComponent {
  // Oak editor prefs
  static editor = { draggable: false, droppable: true };

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
  get project() { return this.controller.project }
  get type() { return this.controller.type; }

// DEPRECATED ???
  static get route() { return this.controller.route }

  //////////////////////////////
  // Rendering
  //////////////////////////////

  getClassName(props) {
    return classNames("oak", this.props.className, "Section");
  }

}

// Oak editor prefs
import { editify } from "../EditorProps";
editify({ draggable: false, droppable: true }, Section);

//////////////////////////////
// Editor.Group class
//
//	Render a group of controls.
//
//////////////////////////////

import React, { PropTypes } from "react";

import { definedProperties } from "oak-roots/util/object";
import { getPath, setPath } from "oak-roots/util/path";
import { classNames, mergeProps } from "oak-roots/util/react";

import Control from "./Control";

const stringOrFn = PropTypes.oneOfType([
	PropTypes.string,
	PropTypes.func
]);

export default class Group extends Control {

  // Pass our `props.name` down as the `namePrefix` of any children.
  static childContextTypes = {
    namePrefix: PropTypes.any
  }

  getChildContext() {
    return {
      namePrefix: this.props.name
    }
  }

  renderControl(props) {
    return (
      <div className='groupWrapper'>
        {props.children}
      </div>
    )
  }

}

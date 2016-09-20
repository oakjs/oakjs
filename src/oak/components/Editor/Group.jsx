//////////////////////////////
// Editor.Group class
//
//  Render a group of controls.
//
//////////////////////////////

import React, { PropTypes } from "react";

import Control from "./Control";

const stringOrFn = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.func
]);

export default class Group extends Control {
  static propTypes = {
    ...Control.propTypes,
    bordered: PropTypes.bool,              // Show border?
  }

  // Pass our `props.name` down as the `namePrefix` of any children.
  static childContextTypes = {
    namePrefix: PropTypes.any
  }

  getChildContext() {
    return {
      namePrefix: this.controlName
    }
  }

  // Put a wrapper around the controls (to separate them from the label).
  renderControl(props) {
    return (
      <div className='groupWrapper'>
        {props.children}
      </div>
    )
  }

}

// Make everything draggable but not droppable
import { editifyMap } from "oak/EditorProps";
editifyMap(exports, { draggable: true, droppable: true });

//////////////////////////////
// Resizer which allows you to drag selected elements
//////////////////////////////

import React, { PropTypes } from "react";

import { autobind } from "oak-roots/util/decorators";

import oak from "../oak";
import ResizeHandle from "./ResizeHandle";

import "./Resizer.css";

export default class Resizer extends React.Component {
  render() {
    const { rect, onMouseDown, children } = this.props;
    return (
      <div className="oak Resizer" style={rect} onMouseDown={onMouseDown}>
        { children }
      </div>
    )
  }
}

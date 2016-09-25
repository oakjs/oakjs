//////////////////////////////
// Overlay which shows/manages selection
//////////////////////////////

import React from "react";
import "./SelectionRect.less";

export default class SelectionRect extends React.Component {
  render() {
    const { type, rect, oid, position, children, onMouseDown } = this.props;

    const rectProps = {
      className: `oak ${type} SelectionRect`,
      style: rect,
      onMouseDown
    }
    // if position was specified, add as attribute to style with CSS
    if (position !== undefined) rectProps["data-position"] = position;

    return (
      <div {...rectProps}>{children}</div>
    )
  }
}

// Oak editor prefs
import DragProps from "oak-roots/DragProps";
DragProps.register("Oak", { draggable: false, droppable: false }, SelectionRect);

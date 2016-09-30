//////////////////////////////
//  Rectangle indicating some sort of selection region.
//  Used extensively by SelectionOverlay, with `className` distinguishing different usages.
//
//  If you pass a `rect` prop, we'll apply that on draw.
//  If you pass a `getRect()` prop, we'll dynamically apply the rectangle on mount/update.
//////////////////////////////

import { updateRect } from "oak-roots/util/react";

import OakComponent from "./OakComponent";

import "./SelectionRect.less";

export default class SelectionRect extends OakComponent {

  // If we have a `getRect()` prop, update rect dynamically on mount/update.
  componentDidMount() {
    super.componentDidMount();
    this.updateRect();
  }

  componentDidUpdate() {
    super.componentDidUpdate();
    this.updateRect();
  }

  // Update our element's style to represent the `rect` returned by `props.getRect()`.
  updateRect() {
    if (this.props.getRect) updateRect(this.ref(), this.props.getRect);
  }


  render() {
    const { type, rect, oid, position, children, onMouseDown } = this.props;

    const rectProps = {
      className: `oak ${type} SelectionRect`,
      onMouseDown
    }

    // Only apply rect if defined, otherwise assume we have a `getRect()` which will set it.
    if (rect) rectProps.style = rect;

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

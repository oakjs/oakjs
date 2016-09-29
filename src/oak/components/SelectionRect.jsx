//////////////////////////////
//  Rectangle indicating some sort of selection region.
//  Used extensively by SelectionOverlay, with `className` distinguishing different usages.
//
//  If you pass a `rect` prop, we'll apply that on draw.
//  If you pass a `getRect()` prop, we'll dynamically apply the rectangle on mount/update.
//////////////////////////////

import React from "react";
import ReactDOM from "react-dom";

import requestAnimationFrame from "oak-roots/util/browser";

import "./SelectionRect.less";

export default class SelectionRect extends React.Component {

  // If we have a `getRect()` prop, update rect dynamically on mount/update.
  componentDidMount() {
    this._isMounted = true;
    if (this.props.getRect) this.updateRect();
  }

  componentWillUpdate() {
     this._isMounted = false;
  }

  componentDidUpdate() {
    this._isMounted = true;
    if (this.props.getRect) this.updateRect();
  }

  componentWillUnmount() {
     this._isMounted = false;
  }

  // Update our element's style to represent the `rect` returned by `props.getRect()`.
  updateRect() {
    // Guard if this is called when we're not mounted.
    if (!this._isMounted) return;

    const getRect = this.props.getRect;
    if (!getRect) return;

    const element = ReactDOM.findNode(this);
    if (!element) return;

    const rect = getRect(this.props);
    const style = (rect ? rect.style : "");

    // Use `requestAnimationFrame` to update so we're separating our read/write cycles.
    // This is recommended for animation speed.
    requestAnimationFrame( () => element.setAttribute("style", style) );
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

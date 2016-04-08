//////////////////////////////
// Drag selection rectangle
//
// Draw this when the mouse goes down and it will draw a dashed rectangle for you
//  and call the `onDrag*` callbacks as the mouse moves.
//////////////////////////////

import React, { PropTypes } from "react";

import Rect from "oak-roots/Rect";

import oak from "../oak";
import SelectionRect from "./SelectionRect";

export default class DragSelectRect extends React.Component {
  static propTypes = {
    // Optional: Return the `clientRect` for the current mouse position.
    getDragRect: PropTypes.func,

    // Optional: Return `{ selection, selectionRects }` for the specified `clientRect`
    getSelectionForRect: PropTypes.func,

    // Optional callbacks for drag events
    //  All will be called as:
    //    `callback(event, { selection, selectionRects })`
    onDragStart: PropTypes.func,
    onDrag: PropTypes.func,
    onDragCancel: PropTypes.func,
    onDragStop: PropTypes.func,
  }

  constructor() {
    super(...arguments);
    this.state = {};
  }

  componentDidMount() {
    this.startDragging();
  }

  //////////////////////////////
  // Drag event handlers
  //////////////////////////////
  startDragging() {
    // Start watching drag when mounted
    oak.event.initDragHandlers({
      flag: "dragSelecting",
      onDragStart: this.props.onDragStart,
      onDrag: this.props.onDrag,
      onDragCancel: this.props.onDragCancel,
      onDragStop: this.props.onDragStop,
      getDragInfo: this.updateSelection
    });
  }

  //////////////////////////////
  // Drag geometry and selection
  //////////////////////////////

  // Return the `clientRect` for the current drag.
  // Defaults to `oak.event.dragClientRect`.
  // If you have another way of calculating it, pass a `getDragRect()` function in your props.
  getDragRect() {
    // Defer to property function if passed
    if (this.props.getDragRect) return this.props.getDragRect();

    return oak.event.dragClientRect;
  }

  // Figure out the intersection of the current `clientRect` and whatever we're selecting.
  // Must return a map of: `{ selection, selectionRects }` (which are both arrays).
  //
  // Defaults to finding all intersecting `oid` elements in the current `oak.editContext`.
  // Pass a `getSelectionForRect()` function in your props to do something different.
  getSelectionForRect(clientRect) {
    // Defer to property function if passed
    if (this.props.getSelectionForRect) return this.props.getSelectionForRect(clientRect);

    const { oids, rects } = oak.getOidRectsForContext(oak.editContext, clientRect);
    return { selection: oids, selectionRects: rects };
  }


  // Update our `state.selection` and `state.selectionRects` based on current geometry.
  updateSelection = () => {
    const rect = this.getDragRect();
    const state = rect
                ? this.getSelectionForRect(rect)
                : { selection: null, selectionRects: null };
    this.setState(state);
    return state;
  }

  //////////////////////////////
  // Rendering
  //////////////////////////////

  renderSelectionRects() {
    const rects = this.state.selectionRects || [];
    return rects.map( (rect, index) => {
      return <SelectionRect key={index} type="dragSelection" rect={rect}/>
    });
  }

  renderDragSelectRect() {
    const rect = this.getDragRect();
    return <SelectionRect type="dragSelect" rect={rect} />
  }

  render() {
    return (
      <div>
        { this.renderSelectionRects() }
        { this.renderDragSelectRect() }
      </div>
    );
  }
}

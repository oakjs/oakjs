//////////////////////////////
// Drag selection rectangle
//
// Draw this when the mouse goes down and it will draw a dashed rectangle for you
//  and call the `onDrag*` callbacks as the mouse moves.
//////////////////////////////

import React, { PropTypes } from "react";

import Rect from "oak-roots/Rect";
import elements from "oak-roots/util/elements";

import oak from "../oak";
import SelectionRect from "./SelectionRect";

export default class DragSelectRect extends React.Component {
  static propTypes = {
    // Return the `clientRect` for the current mouse position.
    getDragRect: PropTypes.func,

    // Return `{ selection, selectionRects }` for the specified `clientRect`
    getSelectionForRect: PropTypes.func,

    // Callbacks for drag events, called as:
    //  `callback(event, { selection, selectionRects })`
    onDragStart: PropTypes.func,
    onDrag: PropTypes.func,
    onDragEnd: PropTypes.func,
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
      onDragEnd: this.props.onDragEnd,
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
  // Defaults to finding all intersecting `oid` elements in the current `oak.editController`.
  // Pass a `getSelectionForRect()` function in your props to do something different.
  getSelectionForRect(clientRect) {
    // Defer to property function if passed
    if (this.props.getSelectionForRect) return this.props.getSelectionForRect(clientRect);

    const { oids, rects } = this.getOidRectsForController(oak.editController, clientRect);
    return { selection: oids, selectionRects: rects };
  }


  // Return a map of `{ oids, rects }` for all `oid` elements on the page.
  //
  // Pass an `onlyOids` map to restrict to only those elements.
  // Pass an `intersectingClientRect` to restrict to only oids which intersect that rect.
  getOidRects(onlyOids, intersectingClientRect) {
// ??? is this necessary
//    if (!oak.page || !oak.page.component) return undefined;
// ???

//    console.time("oidRects");
    //TODO: somehow we want to know the root element on the page so don't include toolbars...
    const oidElements = document.querySelectorAll("[oakid]");
    const oids = [];
    const rects = [];
    let i = -1, element;
    while (element = oidElements[++i]) {
      const oid = element.getAttribute("oakid");

      // skip if not in the `onlyOids` map
      if (onlyOids && onlyOids[oid] === undefined) continue;

      // skip if doesn't intersect the `intersectingClientRect`
      const rect = elements.clientRect(element);
      if (intersectingClientRect && !intersectingClientRect.intersects(rect)) continue;

      // ok, add to our lists
      oids.push(oid);
      rects.push(rect);
    }
//    console.timeEnd("oidRects");
    return { oids, rects };
  }

  // Return a map of `{ oids, rects }` for all `oid` elements on the specified `controller`.
  getOidRectsForController(controller = oak.editController, intersectingClientRect, includeContextRoot = false) {
    const { oids, rects } = this.getOidRects(controller.oids, intersectingClientRect) || {};

    // Remove the controller root oid if specified
    if (!includeContextRoot) {
      const index = oids.indexOf(controller.oid);
      if (index !== -1) {
        oids.splice(index, 1);
        rects.splice(index, 1);
      }
    }

    return { oids, rects };
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
      <div className="oak DragSelectRect">
        { this.renderSelectionRects() }
        { this.renderDragSelectRect() }
      </div>
    );
  }
}

// Oak editor prefs
import DragProps from "oak-roots/DragProps";
DragProps.register("Oak", { draggable: false, droppable: false }, DragSelectRect);

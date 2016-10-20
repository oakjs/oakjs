//////////////////////////////
// Resizer which allows you to drag selected elements
//////////////////////////////

import React, { PropTypes } from "react";

import Rect from "oak-roots/Rect";
import { updateRect, toggleElement } from "oak-roots/util/react";

import OakComponent from "./OakComponent";
import SelectionRect from "./SelectionRect";

import "./Resizer.css";

export default class Resizer extends OakComponent {
  static propTypes = {
    // Array of selected items.
    selection: PropTypes.array,

    // Return a `Rect` for the current position of an item from `selection`.
    getRectForSelectedItem: PropTypes.func,

    // Return a unique identifier for an item from `selection`.
    // By default we'll just `toString()` the item.
    getKeyForSelectedItem: PropTypes.func,

    canResizeWidth: PropTypes.bool,
    canResizeHeight: PropTypes.bool,

    onSelectionDown: PropTypes.func,
    onHandleDown: PropTypes.func,
  };


  //////////////////////////////
  // Events and geometry
  //////////////////////////////

  // Mouse wend down in one of our handles.
  onHandleDown(event, handle) {
    if (this.props.onHandleDown) this.props.onHandleDown(event, handle)
  }

  // Update our child `<SelectionRect>`s to match the current geometry of the `selection`.
  updateGeometry() {
    const { selection } = this.props;
    if (!selection || !selection.length) return null;

    // iterate through selected elements, accumulating `rects` of each
    const rects = [];
    selection.map( item => {
      const element = this.getElement(`selection-${item}`);
      if (!element) return;

      const rect = this.props.getRectForSelectedItem(item);
      updateRect(element, rect);

      // add to the list of rects so we can calculate outer size
      if (rect) rects.push(rect);
    })

    // size the outer rectangle
    const outerRect = Rect.containingRect(rects);
    updateRect(this.getElement(), outerRect);
    updateRect(this.getElement("resizer"), outerRect);

    // Show/hide handles according to outerRect
    const activeHandles = this.getActiveHandles(outerRect);
    this.constructor.ALL_HANDLES.forEach( handle => {
      const element = this.getElement(`handle-${handle}`);
      const isActive = activeHandles.includes(handle)
      toggleElement(element, isActive);
    });

  }

  //////////////////////////////
  // Selection rectangles
  //////////////////////////////

  // Return string key for the `item` from the selection.
  // By default we just convert `item` to a string.
  getKeyForSelectedItem(item) {
    if (this.props.getKeyForSelectedItem) return this.props.getKeyForSelectedItem(item);
    return ""+item;
  }

  // Render a `<SelectionRect>` for each item in the selection.
  // Their geometry will be set in `updateGeometry()`.
  renderSelectionRects() {
    const { selection, onSelectionDown } = this.props;
    return selection.map( item => {
      const key = this.getKeyForSelectedItem(item);
      return <SelectionRect type="selection" key={key} ref={`selection-${key}`} onMouseDown={onSelectionDown}/>
    });
  }

  //////////////////////////////
  // Resize handles
  //////////////////////////////

  static NARROW_WIDTH = 30;
  static SHORT_HEIGHT = 30;
  static ALL_HANDLES = [ "t", "r", "b", "l", "tl","tr", "bl", "br" ];

  // Return the list of resizer handles we should show for the current selection.
  // TODO: don't show handles that don't apply!!!
  getActiveHandles(containingRect) {
    const { canResizeWidth, canResizeHeight } = this.props;
    if (!containingRect || !canResizeWidth && !canResizeWidth) return [];

    const isNarrow = containingRect.width < Resizer.NARROW_WIDTH;
    const isShort = containingRect.height < Resizer.SHORT_HEIGHT;

    if (canResizeWidth && canResizeHeight) {
      if (isNarrow && isShort) return ["br"];
      if (isNarrow) return ["t", "b", "r"];
      if (isShort) return ["l", "r", "b"];
      return ["tl", "tr", "bl", "br", "t", "l", "b", "r"]
    }

    if (canResizeWidth) {
      if (isNarrow) return ["r"];
      return ["l", "r"];
    }

    if (canResizeHeight) {
      if (isShort) return ["b"];
      return ["t", "b"];
    }
  }

  // Render ALL of the possible handles.
  //  We'll actually show or hide them during `updateGeometry()`.
  renderHandles() {
    // TODO: memoize
    if (!this.props.canResizeWidth && !this.props.canResizeHeight) return undefined;

    return this.constructor.ALL_HANDLES.map( handle => <div {...{
      className: `oak ResizeHandle ${handle}`,
      key: handle,
      ref: `handle-${handle}`,
      handle,
      onMouseDown: (event) => this.onHandleDown(event, handle)
    }}/> );
  }

  //////////////////////////////
  // Generic render
  //////////////////////////////

  render() {
    const { selection } = this.props;
    if (!selection || !selection.length) return null;

    return (
      <div className="oak Resizer">
        { this.renderSelectionRects() }
        { <SelectionRect type="resizer" ref="resizer" /> }
        { this.renderHandles() }
      </div>
    )
  }
}

// Oak editor prefs
import DragProps from "oak-roots/DragProps";
DragProps.register("Oak", { draggable: false, droppable: false }, Resizer);

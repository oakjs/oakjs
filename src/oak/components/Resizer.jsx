//////////////////////////////
// Resizer which allows you to drag selected elements
//////////////////////////////

import React, { PropTypes } from "react";

import Rect from "oak-roots/Rect";

import oak from "../oak";
import SelectionRect from "./SelectionRect";
import ResizeHandle from "./ResizeHandle";

import "./Resizer.css";

export default class Resizer extends React.Component {
  // Oak editor prefs
  static editor = { draggable: false, droppable: false };

  static propTypes = {
    selection: PropTypes.any,
    canResizeWidth: PropTypes.bool,
    canResizeHeight: PropTypes.bool,

    onSelectionDown: PropTypes.func,
    onHandleDown: PropTypes.func,
  };


  //////////////////////////////
  // Selection rectangles
  //////////////////////////////

  renderSelectionRects(rects) {
    const { selection } = this.props;
    if (!selection) return null;

    const selectionRects = selection.map( oid => this.renderSelectionRect(oid, rects) )
      .filter(Boolean);

    // if no rects returned, forget it
    if (selectionRects.length === 0) return null;
    return selectionRects;
  }

  // Render an `oid` as a `<SelectionRect>`.
  // If you pass a `rects` array, we'll add the rect of the element to it.
  renderSelectionRect(oid, rects) {
    const rect = oak.getRectForOid(oid);
    if (!rect || rect.isEmpty) return null;

    if (rects) rects.push(rect);
    const rectProps = {
      key: oid,
      type: "selection",
      oid,
      rect,
      onMouseDown: this.props.onSelectionDown
    }
    return <SelectionRect {...rectProps} />;
  }

  //////////////////////////////
  // Resize handles
  //////////////////////////////

  // Return the list of resizer handles we should show for the current selection.
  // TODO: don't show handles that don't apply!!!
  getResizeHandles(containingRect) {
    const { canResizeWidth, canResizeHeight } = this.props;
    if (!canResizeWidth && !canResizeWidth) return undefined;

    const isNarrow = containingRect.width < 60;
    const isShort = containingRect.height < 60;

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

  renderHandles(containingRect) {
    const handles = this.getResizeHandles(containingRect);
    if (!handles) return null;
    return handles.map( handle => this.renderHandle(handle) );
  }

  renderHandle(handle) {
    const handleProps = {
      key: handle,
      handle,
      onMouseDown: (event) => this.props.onHandleDown(event, handle)
    }
    return <ResizeHandle {...handleProps} />;
  }

  render() {
    // rects of all SelectionRects so we know how big the outer bounds are
    const rects = [];
    const selectionRects = this.renderSelectionRects(rects);
    if (!selectionRects) return null;

    // how big is the resizer?
    const resizerRect = Rect.containingRect(rects);

    // Render handles as necessary
    const handles = this.renderHandles(resizerRect);

    return (
      <div className="oak Resizer" style={resizerRect}>
        { selectionRects }
        { <SelectionRect type="resizer" rect={resizerRect} /> }
        { handles }
      </div>
    )
  }
}

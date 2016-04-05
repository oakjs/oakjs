//////////////////////////////
// Overlay which shows/manages selection
//////////////////////////////

import { autobind, throttle } from "oak-roots/util/decorators";
import Rect from "oak-roots/Rect";


import OakComponent from "./OakComponent";
import SelectionRect from "./SelectionRect";
import Resizer from "./Resizer";
import ResizeHandle from "./ResizeHandle";

import "./SelectionOverlay.css";


export default class SelectionOverlay extends OakComponent {

  constructor() {
    super(...arguments);
    this.state = {};
  }

  componentDidMount() {
    super.componentDidMount();
    // update selection rectangle(s) when window scrolls, zooms or resizes
    $(document).on("scroll", this.onScroll);
    $(document).on("zoom", this.onZoom);
    $(window).on("resize", this.onResize);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    $(document).off("scroll", this.onScroll);
    $(document).off("zoom", this.onZoom);
    $(window).off("resize", this.onResize);
  }

  //////////////////////////////
  // Window/document events which change browser geometry
  // and update selection rectangles
  //////////////////////////////

  @autobind
  onScroll(event) {
    this._updateSelectionRects();
  }

  @autobind
  onZoom(event) {
    this._updateSelectionRects();
  }

  @autobind
  onResize(event) {
    this._updateSelectionRects();
  }

  // Update selection due to an event (scroll, zoom, etc).
  @throttle(10)
  _updateSelectionRects() {
    if (!this._isMounted) return;

    // if we have a selection, force update
    if (oak.selection && oak.selection.length) {
      this.forceUpdate();
    }

    this._clearHoverRect();

    this._updateDragSelectRect()
  }

  // NOTE: we set hover rectangle manually rather than fully redrawing
  //       so we're not redrawing the overlay on mousemove.
  //       This is more efficient and prevents cursor flash.
  @throttle(1)
  _updateHoverRect(event) {
    const mouseComponent = oak.event._mouseOid;
    const isInsideHandle = event && $(event.target).is(".ResizeHandle");
    let rect;
    if (mouseComponent && !isInsideHandle && !oak.event.anyButtonDown) {
      rect = oak.getRectForOid(mouseComponent);
    }
    this._moveRect("hover", rect);
  }

  _clearHoverRect() {
    this._moveRect("hover");
  }

  @throttle(1)
  _updateDragSelectRect() {
    if (oak.event.dragSelecting) {
      this._moveRect("dragSelect", oak.event.dragClientRect);
    }
    else {
      this._clearDragSelectRect();
    }
  }

  _clearDragSelectRect() {
    this._moveRect("dragSelect");
  }

  _moveRect(ref, rect) {
    if (!this._isMounted || !this.refs[ref]) return;

    const $element = $(ReactDOM.findDOMNode(this.refs[ref]))
    if (rect) $element.css(rect);
    else      $element.attr("style", "");
  }


  //////////////////////////////
  // Mouse events which manipulate selection
  //////////////////////////////

  @autobind
  onMouseMove(event) {
    this._updateHoverRect(event);
  }

  @autobind
  onMouseDown(event) {
    const oid = oak.event._downOid;
console.info("normal onMouseDown", oid);

    // if no oid, clear selection and return
    if (!oid || oid == this) {
      this.onBackgroundDown(event);
    }
    else {
      this.onSelectionRectDown(event);
    }
  }

  //////////////////////////////
  //  Mouse events on something other than a component element
  //  (including the card itself)
  //////////////////////////////
  onBackgroundDown(event) {
console.info("onBackgroundDown");
    oak.actions.clearSelection();
    oak.event.initDragHandlers(event, {
      flag: "dragSelecting",
      onStart: this.onBackgroundDragStart,
      onDrag: this.onBackgroundDrag,
      onStop: this.onBackgroundDragStop,
      onNoDrag: this.onBackgroundNoDrag,
      preventDefault: true,
      stopPropagation: true
    });
  }

  @autobind
  onBackgroundDragStart(event) {}

  @autobind
  onBackgroundDrag(event) {
    this._updateDragSelectRect();
  }

  @autobind
  onBackgroundDragStop(event) {
    this._clearDragSelectRect();
  }

  @autobind
  onBackgroundNoDrag(event) {}

  //////////////////////////////
  //  Mouse events in <SelectionRect> children
  //////////////////////////////

  @autobind
  onSelectionRectDown(event) {
    const oid = oak.event._downOid;
    if (!oid || oak.editContext && oak.editContext.oid === oid) {
      return this.onBackgroundDown(event);
    }
console.info("onSelectionRectDown", oid);
    // if shift is down,
// TODO: verify that we can multi-select...
    if (oak.event.shiftKey) {
      // toggle selection of the element if there is one
      if (oid) oak.actions.toggleSelection({ elements: oid });
    }
    // otherwise select just the oid
    else if (!oak.selection.includes(oid)) {
      oak.actions.setSelection({ elements: oid });
    }

    if (oak.selection.length) {
      oak.event.initDragHandlers(event, {
        onStart: "dragStart",
//        onDrag: "drag",
        onStop: "dragStop",
        onNoDrag: this.onSelectionRectUp,
        preventDefault: true,
        stopPropagation: true
      });
    }
  }

  @autobind
  // mouse went up on selectionRect WITHOUT dragging
  onSelectionRectUp(event) {
    const oid = oak.event._downOid;
    console.info("onSelectionRectUp", oid);
    if (oid && !oak.event.shiftKey && oak.selection.length > 1) {
      oak.actions.setSelection({ elements: oid });
    }
  }

  //////////////////////////////
  //  Mouse events in a <ResizeHandle> child
  //////////////////////////////

  @autobind
  onResizeHandleDown(event, handle) {
    oak.event.initDragHandlers(event, {
      onStart: (event) => oak.trigger("resizeStart", event, handle),
//      onDrag: (event) => oak.trigger("resize", event, handle),
      onStop: (event) => oak.trigger("resizeStop", event, handle),
      stopPropagation: true,
      preventDefault: true,
    });
  }



  //////////////////////////////
  //  Rendering
  //////////////////////////////


  // Return the list of resizer handles we should show for the current selection.
  // TODO: don't show handles that don't apply!!!
  getResizeHandleNamesForSelection(selection, rect) {
    const canResizeWidth = true;
    const canResizeHeight = true;

    if (!canResizeWidth && !canResizeWidth) return [];

    const isNarrow = rect.width < 60;
    const isShort = rect.height < 60;

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

  renderSelection(selection) {
    // Gather all the rects so we know how big to make the `<Resizer>`.
    const rects = [];
    const selectionRects = selection.map( oid => this.renderSelectionRect(oid, "selection", rects) )
      .filter(Boolean);

    // if no rects returned, forget it
    if (selectionRects.length === 0) return null;

    // Render the `<Resizer>` which appears OVER the `<SelectionRect>`s
    const containingRect = Rect.containingRect(rects);
    return this.renderResizer(selection, selectionRects, containingRect);
  }

  // Render an `oid` as a `<SelectionRect>`.
  // If you pass a `rects` array, we'll add the rect of the element to it.
  renderSelectionRect(oid, type, rects) {
    const rect = oak.getRectForOid(oid);
    if (!rect || rect.isEmpty) return null;

    if (rects) rects.push(rect);

    const rectProps = {
      key: oid,
      type,
      oid,
      rect,
      onMouseDown: this.onSelectionRectDown
    }
    return <SelectionRect {...rectProps} />;
  }

  renderResizer(selection, selectionRects, rect) {
    const handleNames = this.getResizeHandleNamesForSelection(selection, rect);
    const resizeHandles = handleNames.map( handle => this.renderResizeHandle(handle) );

    const resizerProps = {
      ref: "resizer",
      rect,
    }
    return (
      <Resizer {...resizerProps}>
        { selectionRects }
        { <SelectionRect type="resizer" rect={rect} /> }
        { resizeHandles }
      </Resizer>
    );
  }

  renderResizeHandle(handle) {
    const handleProps = {
      key: handle,
      handle,
      onMouseDown: (event) => this.onResizeHandleDown(event, handle)
    }
    return <ResizeHandle {...handleProps} />;
  }

  render() {
    const { oak } = this.context;
    if (!oak.state.editing) return null;

    const props = {
      id: "SelectionOverlay",
      onMouseDown: this.onMouseDown,
      onMouseMove: this.onMouseMove
    }

    return (
      <div {...props}>
        { <SelectionRect ref="hover" type="hover" onMouseDown={this.onSelectionRectDown}/> }
        { this.renderSelection(oak.selection) }
        { <SelectionRect ref="dragSelect" type="dragSelect" /> }
      </div>
    );
  }
}

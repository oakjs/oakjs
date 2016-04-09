//////////////////////////////
// Overlay which shows/manages selection
//////////////////////////////

import { throttle } from "oak-roots/util/decorators";
import Point from "oak-roots/Point";
import Rect from "oak-roots/Rect";

import { getDragPreviewForElements } from "oak-roots/util/elements";

import DragMovePreview from "./DragMovePreview";
import DragSelectRect from "./DragSelectRect";
import OakComponent from "./OakComponent";
import SelectionRect from "./SelectionRect";
import Resizer from "./Resizer";

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

  onScroll = (event) => {
    this._updateSelectionRects();
  }

  onZoom = (event) => {
    this._updateSelectionRects();
  }

  onResize = (event) => {
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
  }

  // NOTE: we set hover rectangle manually rather than fully redrawing
  //       so we're not redrawing the overlay on mousemove.
  //       This is more efficient and prevents cursor flash.
  @throttle(1)
  _updateHoverRect(event) {
    const mouseOid = oak.event._mouseOid;
    const isInsideHandle = event && $(event.target).is(".ResizeHandle");
    let rect;
    if (mouseOid && !isInsideHandle && !oak.event.anyButtonDown) {
      rect = oak.getRectForOid(mouseOid);
    }
    this._moveRect("hover", rect);
  }

  _clearHoverRect() {
    this._moveRect("hover");
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

  onMouseMove = (event) => {
    this._updateHoverRect(event);
  }

  // Mouse down on overlay itself
  onMouseDown = (event) => {
    event.stopPropagation();
    this.startDragSelecting();
  }

  //////////////////////////////
  //  Mouse events in <SelectionRect> children (including the hover element)
  //////////////////////////////

  onSelectionDown = (event) => {
    // if they went down on the editContext root element, start drag selecting
    const oid = oak.event._downOid;
    if (!oid || oak.editContext && oak.editContext.oid === oid) {
      return this.startDragSelecting(event);
    }
//console.info("onSelectionDown", oid);
    // if command/meta down
    if (oak.event.commandKey) {
      event.stopPropagation();
      event.preventDefault();
      this.startDragSelecting();
      return;

    // if shift is down,
// TODO: verify that we can multi-select...
    } else if (oak.event.shiftKey) {
      // toggle selection of the element if there is one
      if (oid) oak.actions.toggleSelection({ elements: oid });
    }
    // otherwise select just the oid
    else if (!oak.selection.includes(oid)) {
      oak.actions.setSelection({ elements: oid });
    }

    // If anything is selected, start dragging
    if (oak.selection.length) {
      event.stopPropagation();
      event.preventDefault();
      this.startDragMoving();
    }
  }

  // mouse went up on selectionRect WITHOUT dragging
  onSelectionRectUp = (event) => {
    const oid = oak.event._downOid;
    console.info("onSelectionRectUp", oid);
    if (oid && !oak.event.shiftKey && oak.selection.length > 1) {
      oak.actions.setSelection({ elements: oid });
    }
  }


  //////////////////////////////
  //  Drag selection
  //////////////////////////////

  // Start drawing a <DragSelectRect> when the mouse goes down.
  startDragSelecting = () => {
    this.setState({ dragSelecting: true });
  }

  renderDragSelectRect() {
    if (!this.state.dragSelecting) return;
    return <DragSelectRect onDragStop={this.onDragSelectionStop} />
  }

  // Callback when drag-selection completes:
  //  `event` is the mouseup event
  //  `selection` is the list of `oids` which were intersected.
  //  `selectionRects` is the list of `clientRect`s for those oids.
  onDragSelectionStop = (event, { selection, selectionRects } = {}) => {
    if (selection && selection.length) {
      oak.actions.setSelection({ elements: selection});
    }
    else {
      oak.actions.clearSelection();
    }
    this.setState({ dragSelecting: false });
  }


  //////////////////////////////
  //  Drag Move
  //////////////////////////////

  startDragMoving(event) {
    const elements = oak.selectedElements;
    if (elements.length === 0) {
      console.warn("SelectionOverlay.startDragMoving(): no elements found for selection!");
      return;
    }

    this.setState({
      dragMoving: true,
      dragSelection: oak.selection,
      dragComponents: oak.selectedComponents,
      dragMovePreview: getDragPreviewForElements(elements)
    });
  }

  renderDragMovePreview() {
    if (!this.state.dragMoving) return;

    const preview = this.state.dragMovePreview;

    const props = {
      offset: preview.offset,
      size: preview.size,
      preview: preview.element,

      onDragStart: this.onDragMoveStart,
      onDrag: this.onDragMove,
      onDragCancel: this.onDragMoveCancel,
      onDragStop: this.onDragMoveStop,
    }
    return <DragMovePreview {...props} />
  }

  onDragMoveStart = (event, info) => {
console.log("startDragMoving", info);
//    oak.actions.removeElements(oak.selection);
  }

  onDragMove = (event, info) => {
    try {
//      oak.actions.removeElements({ elements: this.state.dragSelection });
    }
    catch (e) {}

    const selection = this.state.dragSelection;
    if (info.target) {
      try {
        if (selection.includes(info.target)) return;
console.info("moving ",selection, " into ", info.target);
        oak.actions.moveElement({ parent: info.target, element: selection[0] });
      } catch (e) {}
    }
  }

  onDragMoveCancel = (event, info) => {
  }

  onDragMoveStop = (event, info) => {
console.log("stopDragMoving", info);
    this.setState({
      dragMoving: false,
      dragSelection: undefined,
      dragComponents: undefined,
      dragMovePreview: undefined
    });
  }


  //////////////////////////////
  //  Mouse events in a <ResizeHandle> child
  //////////////////////////////

  onResizeHandleDown = (event, handle) => {
    oak.event.initDragHandlers({
      event,
      onDragStart: (event) => oak.trigger("resizeStart", event, handle),
//      onDrag: (event) => oak.trigger("resize", event, handle),
      onDragStop: (event) => oak.trigger("resizeStop", event, handle),
    });
  }


  //////////////////////////////
  //  Rendering
  //////////////////////////////

  renderHoverElement() {
    if (this.state.dragSelecting) return;
    return <SelectionRect ref="hover" type="hover" onMouseDown={this.onSelectionDown}/>;
  }

  renderSelection() {
    if (this.state.dragSelecting || this.state.dragMoving) return;
    const props = {
      selection: oak.selection,
      canResizeWidth: true,     // TODO
      canResizeHeight: true,    // TODO
      onSelectionDown: this.onSelectionDown,
      onHandleDown: this.onResizeHandleDown
    }
    return <Resizer {...props} />;
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
        { this.renderHoverElement() }
        { this.renderSelection() }
        { this.renderDragSelectRect() }
        { this.renderDragMovePreview() }
      </div>
    );
  }
}

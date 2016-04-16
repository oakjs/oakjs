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
      this.startDragMoving(event);
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
  startDragSelecting = (event) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    this.setState({ dragSelecting: true });
  }

  renderDragSelectRect() {
    if (!this.state.dragSelecting) return;
    return <DragSelectRect onDragEnd={this.onDragSelectionEnd} />
  }

  // Callback when drag-selection completes:
  //  `event` is the mouseup event
  //  `selection` is the list of `oids` which were intersected.
  //  `selectionRects` is the list of `clientRect`s for those oids.
  onDragSelectionEnd = (event, { selection, selectionRects } = {}) => {
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
    // Get all of the draggable components
    const components = oak.selectedComponents
      .filter(component => component.canDrag());

    if (components.length === 0) {
      console.warn("SelectionOverlay.startDragMoving(): no draggable elements found in selection!");
      return;
    }

    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    // get the DOM elements which correspond to those components
    const elements = components.map( component => component.renderedElement );

    // clone the elements for the preview here, so we only do it once per drag
    const preview = getDragPreviewForElements(elements);

    this.setState({
      dragMoving: true,
      dragComponents: components,
      dragOids: components.map( component => component.oid ),
      dropParent: undefined,
      dropPosition: undefined,
      dragMoveProps: {
        preview: preview.element,
        offset: preview.offset,
        size: preview.size,
        onDragStart: this.onDragMoveStart,
        onDrag: this.onDragMove,
        onDragEnd: this.onDragMoveEnd,
        getTarget: (event) => oak.event.mouseComponent
      }
    });
  }

  // NOTE: called repeatedly, don't do anything expensive in here...
  renderDragMovePreview() {
    if (!this.state.dragMoving) return;
    return <DragMovePreview {...this.state.dragMoveProps} />
  }

  onDragMoveStart = (event, info) => {
console.log("startDragMoving", info);
// TODO: if option down, drag a clone
    oak.actions.removeElements({ elements: this.state.dragComponents });
  }

  // `info.target` is the `oid` of the target parent if there is one
  onDragMove = (event, info) => {
    const { dropParent, dropPosition } = this.state;
    const { parent, position } = this.getDropTarget(info.target) || {};

console.info(parent, dropParent, position, dropPosition);

    // Forget it if no change
    if (parent === "NO_CHANGE" || (parent === dropParent && position === dropPosition)) return;

    // if we're already on-screen, undo to remove elements added before
    if (dropParent) {
      oak.undo();
    }

    if (parent) {
      oak.actions.addElements({
        parent,
        position,
        elements: this.state.dragComponents,
        keepOids: true
      });
    }

    this.setState({
      dropParent: parent,
      dropPosition: position,
      dropParentRect: parent && oak.getRectForOid(parent)
    });
  }

  getElement(oid) {
    return oak.editContext.jsxFragment.getElement(oid);
  }

  // Return the `{ parent, position }` where drop should happen.
  // `position` ignores the things being dragged so it's stable as the
  //  `dragComponents` are added and removed.
  //
  // Algorithm:
  //  - iterate through the `oid` children of the `dropParent`
  //   - break children up into rows
  //   - iterate through items in each row:
  //    - if dropping on the "left side" of an element, drop before it
  //    - if dropping on the "right side" or "after" an element, drop after it.
  getDropTarget(mouseComponent) {
    const parent = this.getDropParent(mouseComponent);
    if (!parent) return undefined;

    const position = this.getDropPosition(parent);
    return { parent: parent.oid, position };
  }

  // Figure out the drop parent, starting at the `mouseComponent`
  //  and going up until we find something that can accept the `dragComponents`.
  // Returns `undefined` if no parent found.
  getDropParent(mouseComponent) {
    if (!mouseComponent) return undefined;

    const { dragComponents } = this.state;
    let parent = mouseComponent;
    while (parent) {
      if (parent.canDrop(dragComponents)) return parent;
      parent = this.getElement(parent._parent);
    }
  }

  // Return an array of `{ oid, position, rect }` for children of our dropParent.
  getDropChildrenRects(dropParent) {
    if (typeof dropParent === "string") dropParent = this.getElement(dropParent);
    if (!dropParent || !dropParent.children && !dropParent.children.length) return undefined;

    // divide into rows
    const { dragOids } = this.state;
    const parentRect = oak.getRectForOid(dropParent.oid);
    const rows = [ [] ];
    const tops = [ parentRect.top ];
    let row = 0;
    let lastLeft = 0;
    let positionDelta = 0;

    dropParent.children.forEach( (child, position) => {
      const rect = child.oid && oak.getRectForOid(child.oid);
      if (!rect) return;

      if (lastLeft && rect.left < lastLeft) {
        row++;
        rows[row] = [];
        lastLeft = 0;
        tops[row] = rect.top;
      }
      else {
        lastLeft = rect.left;
        tops[row] = Math.min(rect.top, tops[row]);
      }

      if (dragOids.includes(child.oid)) positionDelta--;

      rows[rows.length - 1].push( { oid: child.oid, position: position + positionDelta, rect: rect } );
    })

    tops[row+1] = parentRect.bottom;

    // adjust tops and bottoms of all rects
    rows.forEach( (row, rowIndex )=> {
      const top = tops[rowIndex];
      const height = tops[rowIndex + 1] - top;

      row.forEach( (info, colIndex) => {
        info.rect.top = top;
        info.rect.height = height;
      });
    });

    // adjust lefts and right of all rects and add a capper column at the end
    rows.forEach( (row, rowIndex )=> {
      let lastLeft = parentRect.left;

      row.forEach( (info, colIndex) => {
        const right = info.rect.left + ( info.rect.width * 2 / 3);
        const left = (colIndex === 0 ? parentRect.left : info.rect.left);

        info.rect.left = lastLeft;
        info.rect.width = right - lastLeft;

        lastLeft = info.rect.right;
      });

      // add another at the end
      const lastOid = row[row.length - 1];
      if (lastOid) {
        const rect = lastOid.rect.clone();
        rect.left = lastLeft;
        rect.width = parentRect.width - lastLeft;
        rows[rowIndex].push( { position: lastOid.position + 1, rect } );
      }
    });

    return [].concat(...rows);


    // divide into rows

    return dropParent.children.map( (child, position) => {
      const rect = child.oid && oak.getRectForOid(child.oid);
      if (!rect) return;

      const adjustedRect = new Rect(parentRect.left, parentRect.top, rect.right - parentRect.left, rect.bottom - parentRect.top);
console.info(adjustedRect);
      return { oid: child.oid, position, rect: adjustedRect }
    }).filter(Boolean);
  }

  // Return the position (index) of the child we should drop BEFORE inside the `dropParent`.
  getDropPosition(dropParent) {
    if (!dropParent || !dropParent.children) return undefined;

    const childRects = this.getDropChildrenRects(dropParent);
    let i = -1, childRect;
    while ((childRect = childRects[++i])) {
      const { oid, position, rect } = childRect;
      if (rect.containsPoint(oak.event.clientLoc)) {
        return position;
      }
    }
    return dropParent.children.length;
  }



  onDragMoveEnd = (event, info) => {
console.log("dragMoveEnd", info);
    this.setState({
      dragMoving: false,
      dragOids: undefined,
      dragComponents: undefined,
      dropParent: undefined,
      dropParentRect: undefined,
      dropPosition: undefined,
      dragMoveProps: undefined
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
      onDragEnd: (event) => oak.trigger("resizeEnd", event, handle),
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

  renderDropChildrenRects() {
    const rects = this.getDropChildrenRects(this.state.dropParent);
    if (!rects) return [];

    return rects.map( ({ oid, position, rect }, rectIndex) => {
      return <SelectionRect key={rectIndex} type="activeDropChild" rect={rect}>{position}</SelectionRect>
    }).filter(Boolean);
  }

  renderDropTargetRect() {
    const rect = this.state.dropParentRect;
    if (!rect) return;

    return [
      <SelectionRect key="dropTarget" type="activeDropTarget" rect={rect.outset(5)}/>
    ].concat(this.renderDropChildrenRects());
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
        { this.renderDropTargetRect() }
      </div>
    );
  }
}

// Oak editor prefs
import { editify } from "../EditorProps";
editify({ draggable: false, droppable: false }, SelectionOverlay);

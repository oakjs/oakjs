//////////////////////////////
// Overlay which shows/manages selection
//////////////////////////////

import { autobind, throttle } from "oak-roots/util/decorators";
import Rect from "oak-roots/Rect";

import OakComponent from "./OakComponent";
import SelectionRect from "./SelectionRect";
import { Resizer } from "./Resizer";

import "./SelectionOverlay.css";


export default class SelectionOverlay extends OakComponent {

  constructor() {
    super(...arguments);
    this.state = {};
  }

  componentDidMount() {
    super.componentDidMount();
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

  @autobind
  onScroll(event) {
    this._updateSelection();
  }

  @autobind
  onZoom(event) {
    this._updateSelection();
  }

  @autobind
  onResize(event) {
    this._updateSelection();
  }

  @autobind
  onMouseMove(event) {
    if (!this._isMounted) return;

    const oid = oak.event._mouseOid;
    if (oid !== this.state.mouseOid) {
      this.setState({ mouseOid: oid });
    }
  }

  @autobind
  onClick(event) {
    const oid = oak.event._downOid;

    // if shift is down,
    if (oak.event.shiftKey) {
      // toggle selection of the element if there is one
      if (oid) oak.actions.toggleSelection({ elements: oid });
    }
    // if nothing under the mouse, clear selection
    else if (!oid) {
      oak.actions.clearSelection();
    }
    // otherwise select just the oid
    else {
      oak.actions.setSelection({ elements: oid });
    }
  }

  // Update selection due to an event (scroll, zoom, etc).
  @throttle(10)
  _updateSelection() {
    if (this._isMounted && this.state.mouseOid || (oak.selection && oak.selection.length)) {
      this.forceUpdate();
    }
  }

  renderSelection(selection) {
    const rects = [];

    // create selection rects for everything in the selection
    const elements = selection.map( (oid, index) => {
      const rect = oak.getRectForOid(oid);
      if (!rect || rect.isEmpty) return undefined;

      // add to the list of rects
      rects.push(rect);
      // return the visible selectionRect
      return <SelectionRect key={oid} oid={oid} rect={rect}/>;
    }).filter(Boolean);

    if (elements.length === 0) return null;

    elements.push( <Resizer key='RESIZER' rect={Rect.containingRect(rects)} /> );

    return elements;
  }

  renderMouseOid(oid) {
    if (!oid) return;
    const rect = oak.getRectForOid(oid);
    if (!rect || rect.isEmpty) return null;

    return <SelectionRect key="mouseover" oid={oid} rect={rect}/>
  }

  render() {
    const { oak } = this.context;
    if (!oak.state.editing) return null;

    const props = {
      id: "SelectionOverlay",
      onClick: this.onClick,
      onMouseMove: this.onMouseMove
    }

    return (
      <div {...props}>
        { this.renderMouseOid(this.state.mouseOid) }
        { this.renderSelection(oak.selection) }
      </div>
    );
  }
}

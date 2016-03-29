//////////////////////////////
// Overlay which shows/manages selection
//////////////////////////////

import { autobind } from "oak-roots/util/decorators";
import Rect from "oak-roots/Rect";

import OakComponent from "./OakComponent";
import SelectionRect from "./SelectionRect";
import { Resizer } from "./Resizer";

import "./SelectionOverlay.css";


export default class SelectionOverlay extends OakComponent {

  constructor() {
    super(...arguments);
  }

  componentDidMount() {
    super.componentDidMount();
    $(document).on("scroll", this.onScroll);
    $(document).on("zoom", this.onZoom);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    $(document).off("scroll", this.onScroll);
    $(document).on("zoom", this.onZoom);
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
  _updateSelection() {
    if (this._isMounted && oak.selection && oak.selection.length) this.forceUpdate();
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

  render() {
    const { oak } = this.context;
    if (!oak.state.editing) return null;

    return (
      <div id="SelectionOverlay" onClick={this.onClick}>
        { this.renderSelection(oak.selection) }
      </div>
    );
  }
}

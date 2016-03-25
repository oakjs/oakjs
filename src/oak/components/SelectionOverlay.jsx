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

  @autobind
  onClick(event) {
    const oid = app.event._downOid;

    // if shift is down,
    if (app.event.shiftKey) {
      // toggle selection of the element if there is one
      if (oid) app.actions.toggleSelection({ elements: oid });
    }
    // if nothing under the mouse, clear selection
    else if (!oid) {
      app.actions.clearSelection();
    }
    // otherwise select just the oid
    else {
      app.actions.setSelection({ elements: oid });
    }
  }

  renderSelection(selection) {
    const rects = [];

    // create selection rects for everything in the selection
    const elements = selection.map( (oid, index) => {
      const rect = app.getRectForOid(oid);
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
    const { app } = this.context;
    if (!app.state.editing) return null;

    return (
      <div id="SelectionOverlay" onClick={this.onClick}>
        { this.renderSelection(app.selection) }
      </div>
    );
  }
}

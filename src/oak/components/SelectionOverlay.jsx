//////////////////////////////
// Overlay which shows/manages selection
//////////////////////////////

import { autobind } from "oak-roots/util/decorators";

import OakComponent from "./OakComponent";
import SelectionRect from "./SelectionRect";

import "./SelectionOverlay.css";


export default class SelectionOverlay extends OakComponent {

  constructor() {
    super(...arguments);
    this.state = { selection: [] };
  }

  @autobind
  onClick(event) {
    const oid = app.event._downOid;
    const selection = (oid ? [oid] : []);
    this.setState({ selection });
  }

  render() {
    const { app } = this.context;
    if (!app.state.editing) return null;

    return (
      <div id="SelectionOverlay" onClick={this.onClick}>
        { this.state.selection.map( oid => <SelectionRect key={oid} oid={oid}/> ) }
      </div>
    );
  }
}

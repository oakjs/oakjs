//////////////////////////////
// Overlay which shows/manages selection
//////////////////////////////

import { autobind } from "oak-roots/util/decorators";

import OakComponent from "./OakComponent";

import "./SelectionRect.css";


export default class SelectionRect extends OakComponent {

  @autobind
  onClick(event) {}

  render() {
    const { app } = this.context;
    const { oid } = this.props;

    const rect = app.getRectForOid(oid);
    return (
      <div className="oak SelectionRect" data-for-oid={oid} style={rect} onClick={this.onClick}/>
    )
  }
}

//////////////////////////////
// Overlay which shows/manages selection
//////////////////////////////

import { autobind } from "oak-roots/util/decorators";

import OakComponent from "./OakComponent";

import "./SelectionRect.css";

export default class SelectionRect extends React.Component {
  render() {
    const { type, rect, oid, onMouseDown } = this.props;

    const rectProps = {
      className: `oak ${type} SelectionRect`,
      style: rect,
      onMouseDown
    }
    return (
      <div {...rectProps}/>
    )
  }
}

// Oak editor prefs
SelectionRect.editor = { draggable: false, droppable: false };


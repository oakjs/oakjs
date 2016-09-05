//////////////////////////////
// Overlay which shows/manages selection
//////////////////////////////

import "./SelectionRect.css";

export default class SelectionRect extends React.Component {
  render() {
    const { type, rect, oid, children, onMouseDown } = this.props;

    const rectProps = {
      className: `oak ${type} SelectionRect`,
      style: rect,
      onMouseDown
    }
    return (
      <div {...rectProps}>{children}</div>
    )
  }
}

// Oak editor prefs
import { editify } from "../EditorProps";
editify({ draggable: false, droppable: false }, SelectionRect);

//////////////////////////////
// Overlay which shows/manages selection
//////////////////////////////

import "./SelectionRect.less";

export default class SelectionRect extends React.Component {
  render() {
    const { type, rect, oid, position, children, onMouseDown } = this.props;

    const rectProps = {
      className: `oak ${type} SelectionRect`,
      style: rect,
      onMouseDown
    }
    if (position !== undefined) rectProps["data-position"] = position;
    return (
      <div {...rectProps}>{children}</div>
    )
  }
}

// Oak editor prefs
import { editify } from "../EditorProps";
editify({ draggable: false, droppable: false }, SelectionRect);

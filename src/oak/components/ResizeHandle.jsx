//////////////////////////////
// Overlay which shows/manages selection
//////////////////////////////

import React from "react";

import "./ResizeHandle.css";

export default function ResizeHandle(props) {
  const { handle, onMouseDown } = props;
  return (
    <div className={`oak ResizeHandle ${handle}`} onMouseDown={onMouseDown}/>
  )
}

// Oak editor prefs
import DragProps from "oak/DragProps";
DragProps.register("Oak", { draggable: false, droppable: false }, ResizeHandle);

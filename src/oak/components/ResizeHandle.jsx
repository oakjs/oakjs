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
ResizeHandle.editor = { draggable: false, droppable: false };

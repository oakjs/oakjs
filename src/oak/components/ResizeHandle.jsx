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
import { editify } from "../EditorProps";
editify("Oak", { draggable: false, droppable: false }, ResizeHandle);

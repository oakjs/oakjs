//////////////////////////////
// Sample editor toolbar
// TODO:  actual contents should come from a dynamic structure...
//////////////////////////////

import React, { PropTypes } from "react";
import { classNames } from "oak-roots/util/react";

import JSXFragment from "../JSXFragment";
import OakComponent from "./OakComponent";

import "./EditorToolbar.less";

export default class EditorToolbar extends OakComponent {
  render() {
    if (this.hidden) return null;

    const { oak } = this.context;
    const { Oak, SUI } = this.context.components;
    return (
      <SUI.Menu id="EditorToolbar" appearance="attached inverted">
        <SUI.Buttons appearance="transparent">
          <SUI.Button onClick={oak.actions.stopSelecting} icon="pointing up" active={oak.editController && !oak.editController.isSelecting}/>
          <SUI.Button onClick={oak.actions.startSelecting} icon="configure" active={oak.editController && oak.editController.isSelecting}/>
          <Oak.Spacer inline/>
        </SUI.Buttons>
        <SUI.Buttons appearance="transparent">
          <SUI.Button onClick={oak.undo} icon="undo" disabled={!oak.canUndo}/>
          <SUI.Button onClick={oak.redo} icon="repeat" disabled={!oak.canRedo}/>
          <Oak.Spacer inline/>
        </SUI.Buttons>
        <SUI.Buttons appearance="transparent" hidden={!oak.editController || !oak.editController.isSelecting || !oak.editController.selection.length}>
          <SUI.Button onClick={oak.actions.removeElements} icon="remove"/>
          <SUI.Button icon="plus"/>
          <SUI.Popup on="click" appearance="inverted" title="Add Component">
            <SUI.Button title="Button" onClick={oak.actions.bind("createElement", { type: "SUI.Button" })}/>
            <SUI.Button title="Card" onClick={oak.actions.bind("createElement", { type: "SUI.Card" })}/>
            <SUI.Button title="Header" onClick={oak.actions.bind("createElement", { type: "SUI.Header" })}/>
            <SUI.Button title="Icon" onClick={oak.actions.bind("createElement", { type: "SUI.Icon" })}/>
          </SUI.Popup>
        </SUI.Buttons>
        <Oak.Spacer inline fluid/>
        <Oak.ActionItem id="oak.saveCurrent" hidden={!oak.editController}/>
      </SUI.Menu>
    );
  }
}


// Oak editor prefs
import DragProps from "oak-roots/DragProps";
DragProps.register("Oak", { draggable: false, droppable: true }, EditorToolbar);

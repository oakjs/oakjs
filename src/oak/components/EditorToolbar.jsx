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
          <SUI.Button onClick={oak.actions.stopEditing} icon="pointing up" active={!oak.isEditing}/>
          <SUI.Button onClick={oak.actions.startEditing} icon="configure" active={oak.isEditing}/>
          <Oak.Spacer inline/>
        </SUI.Buttons>
        <SUI.Buttons appearance="transparent">
          <SUI.Button onClick={oak.undo} icon="undo" disabled={!oak.canUndo}/>
          <SUI.Button onClick={oak.redo} icon="repeat" disabled={!oak.canRedo}/>
          <Oak.Spacer inline/>
        </SUI.Buttons>
        <SUI.Buttons appearance="transparent" visible={oak.isEditing && !oak.selectionIsEmpty} color="red">
          <SUI.Button onClick={oak.actions.removeElements} icon="remove"/>
          <SUI.Button icon="plus"/>
          <SUI.Popup on="click" appearance="inverted" title="Add Component">
            <SUI.Button title="Button" onClick={oak.bindAction("createElement", { type: "SUI.Button" })}/>
            <SUI.Button title="Card" onClick={oak.bindAction("createElement", { type: "SUI.Card" })}/>
            <SUI.Button title="Header" onClick={oak.bindAction("createElement", { type: "SUI.Header" })}/>
            <SUI.Button title="Icon" onClick={oak.bindAction("createElement", { type: "SUI.Icon" })}/>
          </SUI.Popup>
        </SUI.Buttons>
        <Oak.Spacer inline fluid/>
        <Oak.ActionItem id="oak.startEditing"/>
        <SUI.Dropdown items={["Page","Section","Project"]} text={oak.state.editController}/>
        <Oak.ActionItem id="oak.saveCurrent" title="Save"/>
      </SUI.Menu>
    );
  }
}


// Oak editor prefs
import { editify } from "../EditorProps";
editify({ draggable: false, droppable: true }, EditorToolbar);

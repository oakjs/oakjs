//////////////////////////////
// Sample editor toolbar
//////////////////////////////

import React, { PropTypes } from "react";
import { classNames } from "oak-roots/util/react";

import JSXElement from "../JSXElement";
import OakComponent from "./OakComponent";

import "./EditorToolbar.css";

export default class EditorToolbar extends OakComponent {
  removeButton() {
    app.actions.removeElement({element:"oiBgbSMB" });
  }

  addButton() {
    const buttonToAdd = JSXElement.parse("<Button icon='smile'>Love it even more!</Button>");
    app.actions.addChildToElement({ parent: "ftEkGCjX", child: buttonToAdd });
  }

  moveText() {
    app.actions.moveElement({ element: "GIboFkjD", targetParent: "arZsBgMa" });
  }

  render() {
    const { app, components: c } = this.context;
    return (
      <c.Menu id="EditorToolbar" appearance="attached">
        <c.Buttons appearance="transparent">
          <c.Button onClick={app.actions.stopEditing} icon="large pointing up" active={!app.state.editing}/>
          <c.Button onClick={app.actions.startEditing} icon="large configure" active={app.state.editing}/>
        </c.Buttons>
        <c.Spacer inline/>
        <c.Buttons appearance="transparent">
          <c.Button onClick={app.undo} icon="large undo" disabled={!app.canUndo}/>
          <c.Button onClick={app.redo} icon="large repeat" disabled={!app.canRedo}/>
        </c.Buttons>
        <c.Spacer inline/>
        <c.Buttons appearance="transparent">
          <c.Button onClick={this.removeButton} icon="large remove"/>
          <c.Button onClick={this.addButton} icon="large plus"/>
          <c.Button onClick={this.moveText} icon="large move"/>
        </c.Buttons>
        <input/>
      </c.Menu>
    );
  }
}

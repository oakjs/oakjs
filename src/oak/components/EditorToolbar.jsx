// Menu of cards in the current stack.
import React, { PropTypes } from "react";
import { classNames } from "oak-roots/util/react";

import JSXElement from "../JSXElement";
import OakComponent from "./OakComponent";

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
      <c.Menu id="EditorToolbar" appearance="inverted attached">
        <c.Buttons size="tiny" appearance="inverted">
          <c.Button onClick={app.actions.stopEditing} icon="large pointing up" color={app.state.editing ? "" : "primary"}/>
          <c.Button onClick={app.actions.startEditing} icon="large paint brush" color={app.state.editing ? "primary" : ""}/>
        </c.Buttons>
        <c.Spacer inline/>
        <c.Buttons size="tiny" appearance="inverted">
          <c.Button onClick={app.undo} icon="large undo"/>
          <c.Button onClick={app.redo} icon="large repeat"/>
        </c.Buttons>
        <c.Spacer inline/>
        <c.Buttons size="tiny" appearance="inverted">
          <c.Button onClick={this.removeButton} icon="large remove"/>
          <c.Button onClick={this.addButton} icon="large plus"/>
          <c.Button onClick={this.moveText} icon="large move"/>
        </c.Buttons>
      </c.Menu>
    );
  }
}

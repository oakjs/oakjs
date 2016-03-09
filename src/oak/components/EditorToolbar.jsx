// Menu of cards in the current stack.
import React, { PropTypes } from "react";
import { classNames } from "oak-roots/util/react";

import OakComponent from "./OakComponent";

export default class EditorToolbar extends OakComponent {
  render() {
    const { app, components: c } = this.context;
    return (
      <c.Menu id="EditorToolbar" appearance="inverted attached">
        <c.Buttons size="tiny" appearance="inverted">
          <c.Button onClick={oak.actions.stopEditing} icon="large pointing up" color={app.state.editing ? "grey" : "primary"}/>
          <c.Button onClick={oak.actions.startEditing} icon="large paint brush" color={app.state.editing ? "primary" : "grey"}/>
        </c.Buttons>
      </c.Menu>
    );
  }
}

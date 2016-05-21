//////////////////////////////
// ActionItem -- MenuItem which encapsulates an Action
//////////////////////////////

import React, { PropTypes } from "react";
import Action from "oak-roots/Action";

import SUIMenuItem from "themes/SUI/MenuItem";

export default class ActionItem extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,       // `id` of the Action in question.

//REFACTOR: override title, enabled, etc here?

  }

  //////////////////////////////
  // Component lifecyle
  //////////////////////////////

  // Activate this action when the menu item is shown, so we'll get shortcut keys.
  componentDidMount() {
    Action.activate(this.props.id);
  }

  // Deactivate this action when the menu item is hidden.
  componentWillUnmount() {
    Action.deactivate(this.props.id);
  }

  //////////////////////////////
  // Syntactic sugar
  //////////////////////////////
  get id() {
    return this.props.id;
  }
  get action() {
    return Action.get(this.id);
  }



// TODO: activate / deactivate on draw

  toString() {
    return `<ActionItem ${this.id}/>`;
  }

  render() {
    const action = this.action;
    if (!action) {
      console.warn(`${this}: action not found`);
      return null;
    }
    return SUIMenuItem({
      label: action.title,
      hint: action.shortcutHint,
      hidden: !action.visible,
      disabled: !action.enabled,
      onClick: action.handler
    });
  }
}

// Oak editor prefs
import { editify } from "../EditorProps";
editify({ draggable: true, droppable: false }, ActionItem);

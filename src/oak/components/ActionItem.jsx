//////////////////////////////
// ActionItem -- MenuItem (for Menu or toolbar) which encapsulates an Action
//////////////////////////////

import React, { PropTypes } from "react";
import Action from "oak-roots/Action";

import SUIMenuItem from "themes/SUI/MenuItem";

export default class ActionItem extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,        // `id` of the Action in question.
    props: PropTypes.object,                // optional map of argumnts to pass to the action

    // NOTE: you can override any of the MenuItem props as well (label, hidden, etc)...
  }

  //////////////////////////////
  // Component lifecyle
  //////////////////////////////

  // Activate this action when the menu item is shown, so we'll get shortcut keys.
  componentDidMount() {
    if (!this.props.hidden) Action.activate(this.props.id);
  }

  // Deactivate this action when the menu item is hidden.
  componentWillUnmount() {
    if (!this.props.hidden) Action.deactivate(this.props.id);
  }

  render() {
    let { id, props, title, ...itemProps } = this.props;
    const action = Action.get(id, props);

    if (!action) {
      console.warn(`${this}: action not found`);
      return null;
    }

    // add action props to the menuProps, allowing explicit props to win
    // (this lets you, eg, override the label or hidden)
    itemProps = {
      label: (title in this.props ? this.props.title : action.title),
      hint: action.shortcutHint,
      hidden: action.hidden,
      disabled: action.disabled,
      active: action.active,
      onClick: action.execute,
      ...itemProps
    }
    return <SUIMenuItem {...itemProps}/>
  }

  //////////////////////////////
  // Debug
  //////////////////////////////

  toString() {
    return `<Oak.ActionItem ${this.props.id}/>`;
  }
}

// Oak editor prefs
import { editify } from "../EditorProps";
editify({ draggable: true, droppable: false }, ActionItem);

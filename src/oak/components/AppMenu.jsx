//////////////////////////////
// <AppMenu> -- App menu class for use inside the <AppMenubar>
//////////////////////////////

import React, { PropTypes } from "react";

import Dropdown from "themes/SUI/Dropdown";
import Menu from "themes/SUI/Menu";

import "./AppMenu.less";

export default class AppMenu extends Dropdown {

  static defaultProps = {
    ...Dropdown.defaultProps,
    className: "AppMenu",
    showArrow: false,
    action: "hide"
  }

  render() {
    return (
      <Dropdown {...this.props}>
        <Menu>
          {this.props.children}
        </Menu>
      </Dropdown>
    );
  }
}

// Oak editor prefs
import { editify } from "../EditorProps";
editify({ draggable: true, droppable: true }, AppMenu);

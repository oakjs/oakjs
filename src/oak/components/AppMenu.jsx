//////////////////////////////
// <AppMenu> -- App menu class for use inside the <AppMenubar>
//////////////////////////////

import React, { PropTypes } from "react";

import Dropdown from "components/SUI/Dropdown";
import Menu from "components/SUI/Menu";

import "./AppMenu.less";

export default class AppMenu extends Dropdown {

  static defaultProps = {
    ...Dropdown.defaultProps,
    className: "AppMenu",
    showArrow: false,
    action: "hide"
  }

  render() {
    if (this.props.hidden) return null;

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
editify("Oak", { draggable: true, droppable: true }, "AppMenu");

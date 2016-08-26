//////////////////////////////
// Menu of components (eg: components on a page, etc)
//////////////////////////////

import React, { PropTypes } from "react";
import { classNames } from "oak-roots/util/react";

import OakComponent from "./OakComponent";

import "./ComponentMenu.less";

export default class ComponentMenu extends OakComponent {


  // Select a particular item specified by its oid.
  // TODO:  strings ???
  select(oid) {
    return oak.actions.setSelection({ elements: oid });
  }

  // Is some element selected?
  isSelected(oid) {
    return oid && oak.selection.includes(oid);
  }

  // Should some element be "open" in the list?
  isOpen(oid) {
    return this.isSelected(oid)
      || (this.state && this.state.open && this.state.open.includes(oid));
  }

  render() {
    const { oak, components: c } = this.context;
    const { ActionItem, Divider, Dropdown, Menu, MenuItem, Submenu } = c;
    const { controller } = this.props;
    if (!controller) return null;

    return (
      <div className="oak ComponentMenu">
        <ComponentMenuItem menu={this} controller={controller} item={controller.jsxFragment.root}/>
      </div>
    );
  }
}

class ComponentMenuItem extends OakComponent {
  renderChildren(menu, item) {
    if (!item || !item.children) return null;
    return (
      <div className="Children">
        {item.children.map( (child, index) => <ComponentMenuItem key={index} menu={menu} item={child} /> )}
      </div>
    );
  }

  render() {
    const { menu, item } = this.props;

    if (typeof item === "string") return <div className='String'>{item}</div>;

    const { id, className, oid } = item.props || {};

    const open = menu.isSelected(oid);
    const selected = menu.isOpen(oid);

    const elementClass = classNames("Element", { open, selected });
    return (
      <div className={elementClass}>
        <div className="Type" onClick={() => menu.select(oid)}>
          {item.type}
          {id && <span className="id">{id}</span>}
          {className && <span className="className">{className.split(" ").join(".")}</span>}
        </div>
        {this.renderChildren(menu, item)}
      </div>
    )
  }
}

// Oak editor prefs
import { editify } from "../EditorProps";
editify({ draggable: false, droppable: true }, ComponentMenu);

//////////////////////////////
// Menu of components (eg: components on a page, etc)
//////////////////////////////

import React, { PropTypes } from "react";
import { classNames } from "oak-roots/util/react";

import OakComponent from "./OakComponent";

import "./ComponentMenu.less";

export default class ComponentMenu extends OakComponent {
  render() {
    const { oak, components: c } = this.context;
    const { ActionItem, Divider, Dropdown, Menu, MenuItem, Submenu } = c;
    const { controller } = this.props;
    if (!controller) return null;

    return (
      <div className="oak ComponentMenu">
        <ComponentMenuItem controller={controller} item={controller.jsxFragment.root}/>
      </div>
    );
  }
}

class ComponentMenuItem extends OakComponent {
  renderChildren(controller, item) {
    if (!item || !item.children) return null;
    return (
      <div className="Children">
        {item.children.map( (child, index) => <ComponentMenuItem key={index} controller={controller} item={child} /> )}
      </div>
    );
  }

  render() {
    const { controller, item } = this.props;

    if (typeof item === "string") return <div className='String'>{item}</div>;

    const { id, className, oid } = item.props || {};
    const elementClass = classNames("Element", { selected: oid && oak.selection.includes(oid) });
    return (
      <div className={elementClass}>
        <div className="Type" onClick={() => oak.actions.setSelection({ elements: oid }) }>
          {item.type}
          {id && <span className="id">{id}</span>}
          {className && <span className="className">{className.split(" ").join(".")}</span>}
        </div>
        {this.renderChildren(controller, item)}
      </div>
    )
  }
}

// Oak editor prefs
import { editify } from "../EditorProps";
editify({ draggable: false, droppable: true }, ComponentMenu);

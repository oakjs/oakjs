//////////////////////////////
// Menu of components (eg: components on a page, etc)
//////////////////////////////

import React, { PropTypes } from "react";
import { classNames } from "oak-roots/util/react";

import OakComponent from "./OakComponent";

import "./ComponentMenu.less";

export default class ComponentMenu extends OakComponent {

  constructor(props) {
    super(props);
// TODO: get opens according to context `oid` from localStorage ?
    this.state = { opens: {} };
  }

  // Select a particular item specified by its oid.
  // TODO:  how to select strings ???
  select(oid) {
    return oak.actions.setSelection({ elements: oid });
  }

  // Is some element selected?
  isSelected(oid) {
    return oid && oak.selection.includes(oid);
  }


//
//  open / close children
//
  // Should some element be "open" in the list?
  isOpen(oid) {
    return this.state.opens[oid];
  }

  toggle(oid) {
    if (this.isOpen(oid)) this.close(oid);
    else this.open(oid);
  }

  open(oid) {
    const opens = {...this.state.opens};
    opens[oid] = true;

    // if option key is down, open all descendents
    if (oak.event.altKey) {
      this.props.controller.jsxFragment.forEachDescendent(oid, (element) => element.props && (opens[element.props.oid] = true) );
    }

    this.setState({ opens });
  }

  close(oid) {
    const opens = {...this.state.opens};
    delete opens[oid];

    // if option key is down, open all descendents
    if (oak.event.altKey) {
      this.props.controller.jsxFragment.forEachDescendent(oid, (element) => element.props && (delete opens[element.props.oid]) );
    }

    this.setState({ opens });
  }


  render() {
    const { oak, components: c } = this.context;
//    const { } = c;
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
    // singleton text child will be rendered in the "<div.type>" below.
    if (item.children.length === 1 && typeof item.children[0] === "string") return null;
    return (
      <div className="children">
        {item.children.map( (child, index) => <ComponentMenuItem key={index} menu={menu} item={child} /> )}
      </div>
    );
  }

  render() {
    const { components } = this.context;
    const { menu, item } = this.props;

    if (typeof item === "string") return <div className='textNode'>{item}</div>;

    const { children } = item;
    const singleTextChild = children && children.length === 1 && typeof children.text === "string" && children[0];

    const { id, className, oid } = item.props || {};

    const selected = menu.isSelected(oid);
    const open = menu.isOpen(oid);
    const openIcon = (open ? "minus square" : "add square");

    const elementClass = classNames("element", { open, selected });
    return (
      <div className={elementClass}>
        <div className="name">
          {<components.Icon icon={openIcon} onClick={() => menu.toggle(oid)}/>}
          <span className="type" onClick={() => menu.select(oid)}>{item.type}</span>
          {id && <span className="id">{id}</span>}
          {className && <span className="className">{className.split(" ").join(".")}</span>}
          {singleTextChild && <span className="innerText">{children[0]}</span>}
        </div>
        {open && children && children.length && !singleTextChild && this.renderChildren(menu, item)}
      </div>
    )
  }
}

// Oak editor prefs
import { editify } from "../EditorProps";
editify({ draggable: false, droppable: true }, ComponentMenu);

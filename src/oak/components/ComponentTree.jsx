//////////////////////////////
// Menu of components (eg: components on a page, section, etc)
//
// TODO:  layout/popout & scrolling
// TODO:  split panel for editor
// TODO:  shift- and control-click etc to multi-select
// TODO:  base on smarter "menu"?
// TODO:  scroll so selection is visible (both directions)
//////////////////////////////

import React, { PropTypes } from "react";

import PreferentialComponent from "oak-roots/PreferentialComponent";
import { classNames } from "oak-roots/util/react";

import OakComponent from "./OakComponent";

import "./ComponentTree.less";



export default class ComponentTree extends PreferentialComponent(OakComponent) {

  static propTypes = {
    controller: PropTypes.object,
    appearance: PropTypes.string,
  }

//
// Syntactic sugar
//
  getRootElement(props = this.props) {
    return props.controller && props.controller.jsxFragment && props.controller.jsxFragment.root;
  }


//
//  Remember `opens` map for all `<ComponentTrees>` with the same root `oid`.
//

  // Remember opens across sessions.
  static storage = localStorage;

  getPrefId(props) {
    const root = this.getRootElement(props);
    if (root) return `oak.ComponentTree.opensFor.${root.props.oid}`;
  }

  getDefaultPrefs(props) {
    const prefs = { opens: {} };
    // default to opening the root element
    const root = this.getRootElement(props);
    if (root) prefs.opens[root.props.oid] = 1;

    return prefs;
  }


//
//  selection (from `oak.selection`)
//

  // Select a particular item specified by its oid.
  // TODO:  how to select text nodes ???
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
    if (!this.state.opens) return false;
    return this.state.opens[oid];
  }

  toggle(oid) {
    if (this.isOpen(oid)) this.close(oid);
    else this.open(oid);
  }

  open(oid) {
    // clone our opens before modifying.
    const opens = {...this.state.opens};
    opens[oid] = 1;

    // if option key is down, open all descendents
    if (oak.event.altKey) {
      this.props.controller.jsxFragment.forEachDescendent(oid, (element) => element.props && (opens[element.props.oid] = true) );
    }

    this.savePrefs({ opens });
  }

  close(oid) {
    // clone our opens before modifying.
    const opens = {...this.state.opens};
    delete opens[oid];

    // if option key is down, close all descendents
    if (oak.event.altKey) {
      this.props.controller.jsxFragment.forEachDescendent(oid, (element) => element.props && (delete opens[element.props.oid]) );
    }

    this.savePrefs({ opens });
  }

//
//  Render
//

  render() {
    if (this.hidden || !this.props.controller) return null;

    const { controller, className, appearance, ...props } = this.props;
    props.className = classNames("oak", appearance, props.className, "ComponentTree");

    return (
      <div {...props}>
        <ComponentTreeItem menu={this} controller={controller} item={controller.jsxFragment.root}/>
      </div>
    );
  }
}

class ComponentTreeItem extends OakComponent {
  renderChildren(menu, item) {
    if (!item || !item.children) return null;
    // singleton text child will be rendered in the "<div.type>" below.
    if (item.children.length === 1 && typeof item.children[0] === "string") return null;
    return (
      <div className="children">
        {item.children.map( (child, index) => <ComponentTreeItem key={index} menu={menu} item={child} /> )}
      </div>
    );
  }

  render() {
    if (this.hidden) return null;

    const { menu, item } = this.props;
    // Pull out components used below.
    const { SUI } = this.context.components;

    if (typeof item === "string") return <div className='textNode'><SUI.Icon icon="none"/>“{item}”</div>;

    const { children } = item;
    const childCount = (children && children.length) || 0;
    const singleTextChild = childCount === 1 && typeof children[0] === "string" && !!children[0];
    const showChildren = childCount > 0 && !singleTextChild;

    const { id, className, oid, title } = item.props || {};

    const selected = menu.isSelected(oid);
    const open = showChildren && menu.isOpen(oid);
    const openIcon = (open ? "minus" : "add");

    const elementClass = classNames("element", { open, selected });
    return (
      <div className={elementClass}>
        <div className="name">
          {showChildren ? <SUI.Icon icon={openIcon} onClick={() => menu.toggle(oid)}/> : <SUI.Icon icon="none"/>}
          <span className="type" onClick={() => menu.select(oid)}>{item.type}
            {id && <span className="id">#{id}</span>}
            {className && <span className="className">.{className.split(" ").join(".")}</span>}
            {singleTextChild && <span className="innerText">“{children[0]}”</span>}
            {!singleTextChild && title && <span className="title">“{title}”</span>}
          </span>
        </div>
        {open && showChildren && this.renderChildren(menu, item)}
      </div>
    )
  }
}

// Oak editor prefs
import DragProps from "oak-roots/DragProps";
DragProps.register("Oak", { draggable: false, droppable: true }, ComponentTree);

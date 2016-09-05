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

import "./ComponentMenu.less";



export default class ComponentMenu extends PreferentialComponent(OakComponent) {

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
//  Remember `opens` map for all `<ComponentMenus>` with the same root `oid`.
//

  // Remember opens across sessions.
  static storage = localStorage;

  getPrefId(props) {
    const root = this.getRootElement(props);
    if (root) return `oak.ComponentMenu.opensFor.${root.props.oid}`;
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
    if (!this.props.controller) return null;

    const { controller, className, appearance, ...props } = this.props;
    props.className = classNames("oak", appearance, props.className, "ComponentMenu");

    return (
      <div {...props}>
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
    if (this.hidden) return null;

    const { menu, item } = this.props;
    // Pull out components used below.
    const { Icon } = this.context.components;

    if (typeof item === "string") return <div className='textNode'><Icon icon="none"/>“{item}”</div>;

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
          {showChildren ? <Icon icon={openIcon} onClick={() => menu.toggle(oid)}/> : <Icon icon="none"/>}
          <span className="type" onClick={() => menu.select(oid)}>{item.type}</span>
          {id && <span className="id">#{id}</span>}
          {className && <span className="className">.{className.split(" ").join(".")}</span>}
          {singleTextChild && <span className="innerText">“{children[0]}”</span>}
          {!singleTextChild && title && <span className="title">“{title}”</span>}
        </div>
        {open && showChildren && this.renderChildren(menu, item)}
      </div>
    )
  }
}

// Oak editor prefs
import { editify } from "../EditorProps";
editify({ draggable: false, droppable: true }, ComponentMenu);

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
import { classNames } from "oak-roots/util/react";

import OakComponent from "./OakComponent";

import "./ComponentMenu.less";



export default class ComponentMenu extends OakComponent {

  static propTypes = {
    controller: PropTypes.object
  }

  constructor(props) {
    super(props);
    // remember our `opens` from sessionStorage
    this.state = { opens : this.getOpensForController() };
  }

  componentWillReceiveProps(nextProps) {
    // if controller changes,
    if (nextProps.controller !== this.props.controller) {
      // reset our `opens` from sessionStorage
      this.setState({ opens : this.getOpensForController(nextProps.controller) });
    }
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

    this.setOpensForController(opens);
  }

  close(oid) {
    // clone our opens before modifying.
    const opens = {...this.state.opens};
    delete opens[oid];

    // if option key is down, close all descendents
    if (oak.event.altKey) {
      this.props.controller.jsxFragment.forEachDescendent(oid, (element) => element.props && (delete opens[element.props.oid]) );
    }

    this.setOpensForController(opens);
  }


//
//  remember `opens` in sessionStorage for each controller
//

  _getRootForController(controller = this.props.controller) {
    if (controller && controller.jsxFragment) return controller.jsxFragment.root;
  }

  _getLocalStorageOpensKey(controller = this.props.controller) {
    const root = this._getRootForController(controller);
    if (root) `oak.ComponentMenu.opensFor.${root.props.oid}`;
  }


  getOpensForController(controller = this.props.controller) {
    // attempt to pull from localStorage
    const id = this._getLocalStorageOpensKey(controller);
    if (id && sessionStorage[id]) return JSON.parse( sessionStorage[id] );

    const opens = {};
    // default so the root is open
    const root = this._getRootForController(controller);
    if (root) opens[root.props.oid] = 1;

    return opens;
  }

  setOpensForController(opens, controller = this.props.controller) {
    // attempt to save in localStorage
    const id = this._getLocalStorageOpensKey(controller);
    if (id) sessionStorage[id] = JSON.stringify(opens);
    // save in state so we'll redraw
    this.setState({ opens });
  }


//
//  Render
//

  render() {
    const { oak, controllers: c } = this.context;
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
    const { menu, item } = this.props;
    // Pull out components used below.
    const { Icon } = this.context.components;

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
          {<Icon icon={openIcon} onClick={() => menu.toggle(oid)}/>}
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

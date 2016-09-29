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

import "./ComponentTree.less";



export default class ComponentTree extends OakComponent {

  static propTypes = {
    controller: PropTypes.object,
    appearance: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = { opens : this.initOpens(props.controller) };
  }


  // When we receive new props, reset opens if the controller actually changes.
  componentWillReceiveProps(nextProps) {
    if (nextProps.controller !== this.props.controller) {
      this.setState({ opens: this.initOpens(nextProps.controller) });
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

  // Return initial `opens` map given a specified `controller`;
  initOpens(controller) {
    const opens = {};
    if (controller && controller.jsxFragment) opens[controller.jsxFragment.root.oid] = 1;
    return opens;
  }

  // Should some element be "open" in the list?
  isOpen(oid) {
console.log(oid);
    return !!this.state.opens[oid];
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

    this.setState({ opens });
  }

  close(oid) {
    // clone our opens before modifying.
    const opens = {...this.state.opens};
    delete opens[oid];

    // if option key is down, close all descendents
    if (oak.event.altKey) {
      this.props.controller.jsxFragment.forEachDescendent(oid, (element) => element.props && (delete opens[element.props.oid]) );
    }

    this.setState({ opens });
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
    // Pull out components used below.
    const { SUI } = this.context.components;

    // short circuit for text node
    if (typeof this.props.item === "string") {
      return <div className='textNode'><SUI.Icon icon="none"/>“{this.props.item}”</div>;
    }

    const { menu, item: element } = this.props;
    const { oid, children } = element;
    const childCount = (children && children.length) || 0;
    const singleTextChild = childCount === 1 && typeof children[0] === "string" && !!children[0];
    const showChildren = childCount > 0 && !singleTextChild;

    const { id, className, title } = element.props || {};

    const selected = menu.isSelected(oid);
    const open = showChildren && menu.isOpen(oid);
    const openIcon = (open ? "minus" : "add");

    const elementClass = classNames("element", { open, selected });
    return (
      <div className={elementClass}>
        <div className="name">
          {showChildren ? <SUI.Icon icon={openIcon} onClick={() => menu.toggle(oid)}/> : <SUI.Icon icon="none"/>}
          <span className="type" onClick={() => menu.select(oid)}>{element.type}
            {id && <span className="id">#{id}</span>}
            {className && <span className="className">.{className.split(" ").join(".")}</span>}
            {singleTextChild && <span className="innerText">“{children[0]}”</span>}
            {!singleTextChild && title && <span className="title">“{title}”</span>}
          </span>
        </div>
        {open && showChildren && this.renderChildren(menu, element)}
      </div>
    )
  }
}

// Oak editor prefs
import DragProps from "oak-roots/DragProps";
DragProps.register("Oak", { draggable: false, droppable: true }, ComponentTree);

"use strict";
//////////////////////////////
//
//  <Shape> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";

import { isElement, hasClass } from "./SUI";
import ElementBuffer from "./ElementBuffer";
import SUIModuleComponent from "./SUIModuleComponent";

import Side from "./Side";
import "./Shape.css";

const moduleProps = {
  duration: PropTypes.number,           // "Duration of side change animation"

  // SUI callbacks
  beforeChange: PropTypes.func,         // Args: nextSide    "Is called before side change"
                                        // NOTE: if this returns falsy, it cancels the change.
  onChange: PropTypes.func,             // Args: nextSide    "Is called after visible side change"
                                        // NOTE: if this returns falsy, it cancels the change.
}



class SUIShape extends SUIModuleComponent {

  static defaultProps = {
    active: 1,                      // show first item by default
    direction: "right",                 // flip to right by default
  }

  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,

    children: PropTypes.any,

    active: PropTypes.any,            // 1-BASED index or css selector of side to activate
    direction: PropTypes.string,      // default direction to flip

    appearance: PropTypes.string,     // "auto", "square", "irregular", "cube", "text"

    ...moduleProps
  };

  //////////////////////////////
  // Component lifecycle
  //////////////////////////////

  componentDidMount() {
    // if we don't already have an active side
    if (this.$getElement().find(".side.active").length === 0) {
      // activate the initial side BEFORE initializing module
      const { active } = this.props;
      if (active) this.activateSide(active);
    }

    super.componentDidMount();
  }

  componentDidUpdate(prevProps) {
    super.componentDidUpdate(...arguments);

    const { active } = this.props;
    const { active: prevActive } = prevProps;

    if (active !== prevActive) this.flipTo(active);
  }


  //////////////////////////////
  // SUI Shape Module Properties
  //////////////////////////////

  static moduleProps = moduleProps;

  tellModule(...args) {
    return this.$getElement().shape(...args);
  }

  //////////////////////////////
  // SUI Shape Module Behaviors
  //////////////////////////////

  flipUp() { return this.tellModule("flip up") }
  flipDown() { return this.tellModule("flip down") }
  flipLeft() { return this.tellModule("flip left") }
  flipRight() { return this.tellModule("flip right") }
  flipOver() { return this.tellModule("flip over") }
  flipBack() { return this.tellModule("flip back") }

  setNext(selector) { return this.tellModule("set next side", selector) }
  isAnimating() { return this.tellModule("is animating") }
  queueAnimation(animation){ return this.tellModule("queue", animation) }

  // "Forces a reflow on element"
  repaint() { return this.tellModule("repaint") }

  // "Refreshes the selector cache for element sides"
  refresh() { return this.tellModule("refresh") }

  // "Set the next side to next sibling to active element" ???
  setDefaultSide() { return this.tellModule("set default side") }

  // "Sets size of shape to (the content size of the next side)."
  setStageSize() { return this.tellModule("set stage size") }

  // Return the CSS transform to rotate in the specified direction
  getTransformUp() { return this.tellModule("get transform up") }
  getTransformDown() { return this.tellModule("get transform down") }
  getTransformLeft() { return this.tellModule("get transform left") }
  getTransformRight() { return this.tellModule("get transform right") }
  getTransformOver() { return this.tellModule("get transform over") }
  getTransformBack() { return this.tellModule("get transform back") }


  //////////////////////////////
  // Our additions to SUI Module Behaviors
  //////////////////////////////

  // Return a selector for a number (1-BASED index of children) or string side selector.
  getSideSelector(identifier) {
    if (typeof identifier === "number") return `.side:nth-child(${identifier})`;
    return identifier;
  }

  // Flip in the direction specified by our `direction` prop.
  flip() {
    const { direction } = this.props;
    const flipMethod = `flip${direction[0].toUpperCase()}${direction.substr(1)}`;
    if (!this[flipMethod]) console.error(this,".flip(): don't understand direction", direction);
    else this[flipMethod]();
  }

  flipTo(identifier) {
    const selector = this.getSideSelector(identifier);
    this.setNext(selector);
    this.flip();
  }

  // Activate side IMMEDIATELY
  activateSide(identifier) {
    const selector = this.getSideSelector(identifier);
    this.$getElement().find(selector).first().addClass("active");
  }


  //////////////////////////////
  // Rendering
  //////////////////////////////

  render() {
    const {
      id, className, style,
      // appearance
      appearance,
    } = this.props;

    const elements = new ElementBuffer({
      props : {
        ...this.getUnknownProps(),
        id,
        style,
        className: [className, "ui", appearance, "shape"]
      }
    });

    let { children } = this.props;
    // if we got a single `sides` element, just insert that
    if (hasClass(children, "sides")) {
      elements.append(children);
    }
    else {
      // normalize to an array
      if (!Array.isArray(children)) children = [children];
      // wrap all in `.side` if necessary
      const wrapped = children.filter(Boolean).map( child => {
        if (isElement(child, Side) || hasClass(child, "side")) return child
        return <div className="side">{child}</div>;
      });
      elements.appendWrapped("div", "sides", wrapped);
    }

    return elements.render();
  }
}

export default SUIShape;

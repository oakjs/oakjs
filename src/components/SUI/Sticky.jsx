"use strict";
//////////////////////////////
//
//  <Sticky> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";

import { isElement, hasClass } from "./SUI";
import ElementBuffer from "./ElementBuffer";
import SUIModuleComponent from "./SUIModuleComponent";

const moduleProps = {
  context: PropTypes.any,               // default: false      Context which sticky element should stick to
  scrollContext: PropTypes.any,         // default: window    Context which sticky should attach onscroll events.
  pushing: PropTypes.bool,              // default: false      Whether element should be "pushed" by the viewport, attaching to the bottom of the screen when scrolling up
  jitter: PropTypes.number,             // default: 5          Sticky container height will only be set if the difference between heights of container and context is larger than this jitter value.
  observeChanges: PropTypes.bool,       // default: false      Whether any change in context DOM should automatically refresh cached sticky positions
  offset: PropTypes.number,             // default: 0          Offset in pixels from the top of the screen when fixing element to viewport
  bottomOffset: PropTypes.number,       // default: 0          Offset in pixels from the bottom of the screen when fixing element to viewport

  // SUI Callbacks
  onReposition: PropTypes.func,         // Args:              Callback when element is repositioned from layout change
  onScroll: PropTypes.func,             // Args:              Callback when requestAnimationFrame fires from scroll handler.
  onStick: PropTypes.func,              // Args:              Callback when element is fixed to page
  onUnstick: PropTypes.func,            // Args:              Callback when element is unfixed from page
  onTop: PropTypes.func,                // Args:              Callback when element is bound to top of parent container
  onBottom: PropTypes.func,             // Args:              Callback when element is bound to bottom of parent container
}



class SUISticky extends SUIModuleComponent {
  static defaultProps = {
//    side: "top"
  };

  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,

    appearance: PropTypes.string,       // "fitted"
    side: PropTypes.string,             // "top" or "bottom"

    bound: PropTypes.bool,
    fixed: PropTypes.bool,

    ...moduleProps
  };

  //////////////////////////////
  // Component lifecycle
  //////////////////////////////

  constructor() {
    super(...arguments);
  }

  componentDidMount() {
    super.componentDidMount();
  }

  componentDidUpdate(prevProps) {
    super.componentDidUpdate(...arguments);
  }


  //////////////////////////////
  // SUI Sticky Module Properties
  //////////////////////////////

  static moduleProps = moduleProps;

  tellModule(...args) {
    return this.$ref().sticky(...args);
  }

  setModuleProps(props) {
    if (!props) return this;

    // set module props after a short delay to let the rest of the page settle out
    window.requestAnimationFrame(() => {
      if (typeof props.context === "function") props.context = props.context();
      this.tellModule(props);
    });
    return this;
  }


  //////////////////////////////
  // SUI Sticky Module Behaviors
  //////////////////////////////


  //////////////////////////////
  // Our additions to SUI Module Behaviors
  //////////////////////////////

  render() {
    const {
      id, className, style,
      children,
      appearance, side, bound, fixed,
    } = this.props;

    const elements = new ElementBuffer({
      props : {
        ...this.getUnknownProps(),
        id,
        style,
        className: [className, "ui", appearance, { bound, fixed }, side, "sticky" ]
      }
    });

console.dir(elements.props);

    elements.append(children);
    return elements.render();
  }
}


export default SUISticky;

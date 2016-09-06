"use strict";
//////////////////////////////
//
//  <Sidebar> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import { autobind } from "oak-roots/util/decorators";

import ElementBuffer from "./ElementBuffer";
import SUIModuleComponent from "./SUIModuleComponent";

const moduleProps = {
//  context: PropTypes.any,             // default: body      Context which sidebar will appear inside
  exclusive: PropTypes.bool,            // default:  false     Whether multiple sidebars can be open at once
  closable: PropTypes.bool,             // default:  true      Whether sidebar can be closed by clicking on page
  dimPage: PropTypes.bool,              // default:  true      Whether to dim page contents when sidebar is visible
  scrollLock: PropTypes.bool,           // default:  false      Whether to lock page scroll when sidebar is visible
  returnScroll: PropTypes.bool,         // default:  false      Whether to return to original scroll position when sidebar is hidden, automatically occurs with transition: scale
  delaySetup: PropTypes.bool,           // default:  false      When sidebar is initialized without the proper HTML, using this option will defer creation of DOM to use requestAnimationFrame.

  // animation
  transition: PropTypes.string,         // default: auto      Named transition to use when animating sidebar. Defaults to 'auto' which selects transition from defaultTransition based on direction.
  mobileTransition: PropTypes.string,   // default: auto      Named transition to use when animating when detecting mobile device. Defaults to 'auto' which selects transition from defaultTransition based on direction.
  defaultTransition: PropTypes.object,  // default: (object)  Default transitions for each direction and screen size, used with transition: auto
  useLegacy: PropTypes.bool,            // default: false      Whether Javascript animations should be used. Defaults to false. Setting to auto will use legacy animations only for browsers that do not support CSS transforms
  duration: PropTypes.number,           // default: 500        Duration of sidebar animation when using legacy Javascript animation
  easing: PropTypes.any,                // default: easeInOutQuint  Easing to use when using legacy Javascript animation

  // SUI Callbacks
//NOTE: these are the opposite of Modal (for Modal, onVisible fires AFTER animating and onShow fires BEFORE)
  onVisible: PropTypes.func,            // Args:              Is called when a sidebar begins animating in.
  onShow: PropTypes.func,               // Args:              Is called when a sidebar has finished animating in.
  onChange: PropTypes.func,             // Args:              Is called when a sidebar begins to hide or show
  onHide: PropTypes.func,               // Args:              Is called before a sidebar begins to animate out.
  onHidden: PropTypes.func,             // Args:              Is called after a sidebar has finished animating out.
}



class SUISidebar extends SUIModuleComponent {
  static defaultProps = {
    direction: "left",
    visible: false
  }

  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,

    content: PropTypes.any,
    children: PropTypes.any,

    visible: PropTypes.bool,

    appearance: PropTypes.string,       // e.g. "inverted vertical menu", "labeled icon menu"
    direction: PropTypes.string,             // "top", "left", "bottom", "right"
    width: PropTypes.string,            // "thin", "very thin", "wide", "very wide"
    ...moduleProps
  };

  //////////////////////////////
  // Component lifecycle
  //////////////////////////////

  componentDidMount() {
    super.componentDidMount();

    const { visible } = this.props;
    if (visible) this.show();
  }

  componentDidUpdate() {
    super.componentDidUpdate();
    const { visible } = this.props;
    if (this.isVisible() && !visible) this.hide();
  }

  //////////////////////////////
  // SUI Sidebar Module Properties
  //////////////////////////////

  static moduleProps = moduleProps;

  tellModule(...args) {
    return this.$ref().sidebar(...args);
  }

  setModuleProps(props = {}) {
    props.context = this.$ref().parent();
    super.setModuleProps(props);
  }


  //////////////////////////////
  // SUI Sidebar Module Behaviors
  //////////////////////////////

  show() { this.tellModule("show"); return this;}
  toggle() { this.tellModule("toggle"); return this; }
  hide() { this.tellModule("hide"); return this; }

  isVisible() { return this.tellModule("is visible") }
  isHidden() { return this.tellModule("is hidden") }
  getDirection() { return this.tellModule("get direction") }

  pushPage() { return this.tellModule("push page") }
  pullPage() { return this.tellModule("pull page") }

  addBodyCSS() { return this.tellModule("add body CSS") }
  removeBodyCSS() { return this.tellModule("remove body CSS") }
  getTransitionEvent() { return this.tellModule("get transition event") }

  attachEvents(selector, event) { return this.tellModule("attach events", selector, event) }


  //////////////////////////////
  // Our additions to SUI Module Behaviors
  //////////////////////////////

  setTransition(transition) { this.tellModule("setting", "transition", transition); return this; }

  //////////////////////////////
  // Rendering
  //////////////////////////////

  render() {
    const {
      id, className, style,
      content, children,
      appearance, direction, width,
    } = this.props;

    const elements = new ElementBuffer({
      props : {
        id,
        style,
        className: [ className, "ui", direction, width, appearance, "sidebar" ]
      }
    });
    if (content) elements.append(content);
    if (children) elements.append(children);
    return elements.render();
  }
}


export default SUISidebar;

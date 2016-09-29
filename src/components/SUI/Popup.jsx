"use strict";
//////////////////////////////
//
//  <Popup> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";

import { isElement, hasClass } from "./SUI";
import ElementBuffer from "./ElementBuffer";
import SUIModuleComponent from "./SUIModuleComponent";





const moduleProps = {
  popup: PropTypes.any,             // default: false         Can specify a DOM element that should be used as the popup.
                                    //                        This is useful for including a pre-formatted popup.
  exclusive: PropTypes.bool,        // default: false         Whether all other popups should be hidden when this popup is opened
  movePopup: PropTypes.bool,        // default: true          Whether to move popup to same offset container as target element
                                    //                        when popup already exists on the page. Using a popup inside of
                                    //                        an element without overflow:visible, like a sidebar,
                                    //                        may require you to set this to false
  context: PropTypes.any,           // default: "body"        Selector or jquery object specifying where the popup should be created
  jitter: PropTypes.number,         // default: 2             Number of pixels that a popup is allowed to appear outside
                                    //                        the boundaries of its context. This allows for permissible rounding
                                    //                        errors when an element is against the edge of its context.
  position: PropTypes.string,       // default: "top left"    Position that the popup should appear
  inline: PropTypes.bool,           // default: false         If a popup is inline it will be created next to current element,
                                    //                        allowing for local css rules to apply. It will not be removed
                                    //                        from the DOM after being hidden. Otherwise popups will appended
                                    //                        to body and removed after being hidden.
  preserve: PropTypes.bool,         // default: false         Whether popup contents should be preserved in the page
                                    //                        after being hidden, allowing it to re-appear slightly faster
                                    //                        on subsequent loads.
  prefer: PropTypes.string,         // default: "adjacent"    Can be set to 'adjacent' or 'opposite' to prefer adjacent
                                    //                        or opposite position if popup cannot fit on screen
  lastResort: PropTypes.bool,       // default: false         When set to false, a popup will not appear and produce an error message
                                    //                        if it cannot entirely fit on page. Setting this to a position like,
                                    //                        right center forces the popup to use this position as a last resort
                                    //                        even if it is partially offstage. Setting this to true will use
                                    //                        the last attempted position.
  on: PropTypes.any,                // default: "hover"        Event used to trigger popup. Can be either focus, click, hover, or manual.
                                    //                        Manual popups must be triggered with $('.element').popup('show');
  delay: PropTypes.object,          // default: { show: 50, hide: 0 }
                                    //                        Delay in milliseconds before showing or hiding a popup on hover or focus
  transition: PropTypes.string,     // default: "slide down"  Named transition to use when animating menu in and out.
                                    //                        Fade and slide down are available without including ui transitions
  duration: PropTypes.number,       // default: 200            Duration of animation events
  setFluidWidth: PropTypes.bool,    // default: true          Whether popup should set fluid popup variation width on load
                                    //                        to avoid width: 100% including padding
  hoverable: PropTypes.bool,        // default: false         Whether popup should not close on hover (useful for popup navigation menus)
  closable: PropTypes.bool,         // default: true          When using on: 'click' specifies whether clicking the page should close the popup
  addTouchEvents: PropTypes.bool,   // default: true          When using on: 'hover' whether touchstart events should be added
                                    //                        to allow the popup to be triggered
  hideOnScroll:PropTypes.string,    // default: "auto"        Whether popup should hide on scroll or touchmove,
                                    //                        auto only hides for popups without on: 'click'.
                                    //                        Set this to false to prevent mobile browsers from closing popups
                                    //                        when you tap inside input fields.
  distanceAway: PropTypes.number,   // default:  0              Offset for distance of popup from element
  offset: PropTypes.number,         // default:  0              Offset in pixels from calculated position
  maxSearchDepth: PropTypes.number, // default:  10            Number of iterations before giving up search for popup position
                                    //                        when a popup cannot fit on screen

  variation: PropTypes.any,         // default: undefined     Popup variation to use, can use multiple variations with a space delimiter
                                    //                        NOTE: preferred to use `appearance` instead...
  // SUI Callbacks
  onCreate: PropTypes.func,         // Args:  $module          Callback on popup element creation, with created popup
  onRemove: PropTypes.func,         // Args:  $module          Callback immediately before Popup is removed from DOM
  onShow: PropTypes.func,           // Args:  $module          Callback before popup is shown. Returning false from this callback will cancel the popup from showing.
  onVisible: PropTypes.func,        // Args:  $module          Callback after popup is shown
  onHide: PropTypes.func,           // Args:  $module          Callback before popup is hidden. Returning false from this callback will cancel the popup from hiding.
  onHidden: PropTypes.func,         // Args:  $module          Callback after popup is hidden
  onUnplaceable: PropTypes.func,    // Args:  $module          Callback after popup cannot be plaed on screen
}



class SUIPopup extends SUIModuleComponent {

  static defaultProps = {}

  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,

    title: PropTypes.any,            // Title to display alongside content
    content: PropTypes.any,          // Content to display
    html: PropTypes.any,             // html alternative to children
    children: PropTypes.any,         // html alternative to children

    appearance: PropTypes.string,    // "basic", "very wide", "fluid", "flowing", "inverted"
    size: PropTypes.string,          // "mini", "tiny", "small", "medium", "large", "huge"

    target: PropTypes.any,           // Target selector or `undefined` to work for the previous element.

    ...moduleProps
  };

  //////////////////////////////
  // Component lifecycle
  //////////////////////////////

  componentDidMount() {
    super.componentDidMount();
  }

  componentDidUpdate(prevProps) {
    super.componentDidUpdate(...arguments);
  }


  //////////////////////////////
  // SUI Popup Module Properties
  //////////////////////////////

  static moduleProps = moduleProps;

  getTarget() {
    const { target } = this.props;

    // string = global selector
    if (typeof target === "string") return $(target);

    // jquery object -- just use that
    if (target && target.jquery) return target;

    // if not specified, use previously defined element
    return this.$ref().prev();
  }

  tellModule(...args) {
    const $target = this.getTarget();
    $target.popup(...args);
  }

  setModuleProps(props) {
    if (props) {
      props.target = this.getTarget();
      props.popup = this.$ref();
    }
    super.setModuleProps(props);
  }


  //////////////////////////////
  // SUI Popup Module Behaviors
  //////////////////////////////

  show() { return this.tellModule("show") }
  toggle() { return this.tellModule("toggle") }
  hide() { return this.tellModule("hide") }
  hideAll() { return this.tellModule("hide all") }

  isVisible() { return this.tellModule("is visible") }
  isHidden() { return this.tellModule("is hidden") }

  exists() { return this.tellModule("exists") }
  getPopup() { return this.tellModule("get popup") }

  reposition() { return this.tellModule("reposition") }
  setPosition(postion) { return this.tellModule("set position", position) }

  destroy() { return this.tellModule("destroy") }
  removePopup() { return this.tellModule("remove popup") }

  //////////////////////////////
  // Our additions to SUI Module Behaviors
  //////////////////////////////


  //////////////////////////////
  // Rendering
  //////////////////////////////

  render() {
    const {
      id, className, style,
      title, content, html, children,
      appearance, variation, size,
    } = this.props;

    const elements = new ElementBuffer({
      props : {
        ...this.getUnknownProps(),
        id,
        style,
        className: [className, "ui", appearance, variation, size, "popup"]
      }
    });

    if (title) elements.appendWrapped("div", "header", title);
    if (content) elements.append(content);
    if (html) elements.append(html);
    if (children) elements.append(children);

    return elements.render();
  }
}

export default SUIPopup;

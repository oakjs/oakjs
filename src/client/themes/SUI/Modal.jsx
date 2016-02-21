"use strict";
//////////////////////////////
//
//  <Modal> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import ReactDOM from "react-dom";
import { autobind } from "oak-roots/util/decorators";

import Button from "./Button";
import ElementBuffer from "./ElementBuffer";
import Header from "./Header";
import SUIComponent from "./SUIComponent";
import Stub from "./Stub";

import { isElement, hasClass } from "./SUI";
import { getActionClass } from "./constants";

const moduleProps = {
// We NEED detachable to be false for this scheme to work
//  detachable: PropTypes.bool,             // default: true        If set to false will prevent the modal from being moved to inside the dimmer
  autoFocus: PropTypes.bool,              // default: true        When true, the first form input inside the modal will receive focus when shown. Set this to false to prevent this behavior.
  observeChanges: PropTypes.bool,         // default: false       Whether any change in modal DOM should automatically refresh cached positions
  allowMultiple: PropTypes.bool,          // default: false       If set to true will not close other visible modals when opening a new one
  offset: PropTypes.number,               // default: 0           A vertical offset to allow for content outside of modal, for example a close button, to be centered.
  context: PropTypes.any,                 // default: "body"      Selector or jquery object specifying the area to dim
  closable: PropTypes.bool,               // default: true        Setting to false will not allow you to close the modal by clicking on the dimmer
  dimmerSettings: PropTypes.object,       // default: (object)    You can specify custom settings to extend UI dimmer
  transition: PropTypes.string,           // default: "scale"     Named transition to use when animating menu in and out.
  duration: PropTypes.number,             // default: 400         Duration of animation
  queue: PropTypes.bool,                  // default: false       Whether additional animations should queue

  // dimmer settings
  inverted: PropTypes.bool,               // default: false       Invert the dimmer?
  blurring: PropTypes.bool,               // default: false       Blur the dimmer?

  // events
  onShow: PropTypes.func,                 // Args:                Is called when a modal starts to show.
  onVisible: PropTypes.func,              // Args:                Is called after a modal has finished showing animating.
  onHide: PropTypes.func,                 // Args:                Is called after a modal starts to hide.
  onHidden: PropTypes.func,               // Args:                Is called after a modal has finished hiding animation.
  onApprove: PropTypes.func,              // Args: $element       Is called after a positive, approve or ok button is pressed.
                                          //                      If the function returns false the modal will not hide.
  onDeny: PropTypes.func,                 // Args: $element       Is called after a negative, deny or cancel button is pressed.
                                          //                      If the function returns false the modal will not hide.
}


// NOTE: We do NOT extend from SUIComponent because
//       we only initialize the modal when showing.
class SUIModal extends SUIComponent {
  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,

    header: PropTypes.any,
    content: PropTypes.any,
    actions: PropTypes.any,
    children: PropTypes.any,

    appearance: PropTypes.string,       //  "basic"
    size: PropTypes.string,

    // pull inverted and blurring out of moduleProps
    //  - we have to set them manually right before showing
    inverted: PropTypes.bool,               // default: false       Invert the dimmer?
    blurring: PropTypes.bool,               // default: false       Blur the dimmer?


    ...moduleProps
  };

  //////////////////////////////
  // Component lifecycle
  //////////////////////////////

  constructor() {
    super(...arguments);
  }

  componentDidMount() {
    // render our stuff inside the the spot where SUI wants to put it
    let $SUIModalsContainer = $("body > .ui.modals");
    if ($SUIModalsContainer.length === 0) {
      $SUIModalsContainer = $("<div class='ui dimmer modals'/>");
      $("body").append($SUIModalsContainer);
    }

    // create a $modalContainer inside that specifically for our modal
    // otherwise react will replace one overlay with another
    this.$modalContainer = $("<div class='modalContainer'/>");
    $SUIModalsContainer.append(this.$modalContainer);
  }

  componentDidUpdate() {
    if (this.isActive()) this.renderModal();
  }

  componentWillUnmount() {
    // TODO: is there anything else to do to tear down the modal?
    if (this.$modal) this.$modal.remove();
    if (this.$modalContainer) this.$modalContainer.remove();
  }


  //////////////////////////////
  // Syntactic sugar
  //////////////////////////////


  //////////////////////////////
  // SUI Modal Module Properties
  //////////////////////////////

  static moduleProps = moduleProps;

  // Given an object of props, return a map with non-undefined props
  //  which we pass to the `.tellModule()` method to initialize / update the module.
  getModuleProps(props = this.props) {
    return knownProperties(props, this.constructor.moduleProps);
  }

  setModuleProps(props = this.getModuleProps()) {
    // force detachable off or our rendering will mess up
    props.detachable = false;
    this.tellModule(props);
    return this;
  }

  tellModule(...args) {
    // draw the modal first if it hasn't been done already
    if (!this.$modal) {
      this.renderModal();
      this.setModuleProps();
    }
    return this.$modal.modal(...args);
  }

  //////////////////////////////
  // SUI Modal Module Behaviors
  //////////////////////////////

  show() { this.tellModule("show"); return this;}
  toggle() { this.tellModule("toggle"); return this; }
  hide() { this.tellModule("hide"); return this; }
  hideAll() { this.tellModule("hide all"); return this; }
  hideOthers() { this.tellModule("hide others"); return this; }

  isActive() { return this.tellModule("is active") }
  setActive() { return this.tellModule("set active") }

  showDimmer() { this.tellModule("show dimmer"); return this; }
  hideDimmer() { this.tellModule("hide dimmer"); return this; }

  refresh() { this.tellModule("refresh"); return this; }
  cacheSizes() { this.tellModule("cache sizes"); return this; }
  canFit() { return this.tellModule("can fit") }

  //////////////////////////////
  // Our additions to SUI Module Behaviors
  //////////////////////////////



  //////////////////////////////
  // Rendering
  //////////////////////////////

  renderHeader(props, elements) {
    const { header } = props;
    if (!header) return;

    if (isElement(header, Header) || hasClass(header, "header")) {
      elements.append(header);
    }
    else {
      elements.appendWrapped("div", "header", header);
    }
  }

  renderActions(props, elements) {
    const { actions } = props;
    if (!actions) return;

    let actionElements;
    if (Array.isArray(actions)) {
      actionElements = actions.map( action => this.renderAction(action) );
    }
    else if (typeof action === "string") {
      actionElements = [this.renderStringAction(action)];
    }
    // assume a map of className => title
    else {
      actionElements = Object.keys(action).map( className => this.renderAction({ className, type: action[className] }) );
    }
    if (actionElements.length) elements.appendWrapped("div", "actions", actionElements);
  }

  renderAction(action) {
    if (typeof action === "string") return this.renderStringAction(action);
    if (isElement(action)) return action;
    return <Button {...action}/>
  }


  renderStringAction(title, className) {
    const buttonProps = {
      title,
      className: className || getActionClass(title),
    }
    return <Button {...buttonProps}/>;
  }

  // Render the actual contents of the modal
  // Split out because we need to render it in a special place -- see componentDidMount
  renderModal(props = this.props) {
    const {
      id, className, style,
      header, content, actions, children,
      appearance, size,
    } = props;

    const elements = new ElementBuffer({
      props : {
        id,
        style,
        className: [className, "ui", appearance, size, "modal"]
      }
    });

    if (header) this.renderHeader(props, elements)
    if (content) elements.appendWrapped("div", "content", content);
    if (children) elements.append(children);
    if (actions) this.renderActions(props, elements);

    // Render the modal inside our $modalContainer (set up in `componentDidMount()`)
    // and remember it so we can call SUI methods on it.
    this.$modal = $(ReactDOM.render(elements.render(), this.$modalContainer[0]));
  }

  // We don't actually render the modal in the normal way, instead we render manually
  // via `renderModal()` in `componentDidMount` and `componentWillReceiveProps`.
  render() {
    return <Stub/>
  }
}

export default SUIModal;

"use strict";
//////////////////////////////
//
//  <Modal> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import ReactDOM from "react-dom";
import { autobind } from "core-decorators";

import Button from "./Button";
import ElementBuffer from "./ElementBuffer";
import Header from "./Header";
import SUIModuleComponent from "./SUIModuleComponent";
import Stub from "./Stub";

import { isElement, hasClass } from "./SUI";

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


class SUIModal extends SUIModuleComponent {
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
    fullscreen: PropTypes.bool,

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
    this.$modalContainer = $("<div/>");
    $SUIModalsContainer.append(this.$modalContainer);

    // now render the modal inside our $modalContainer
    this.renderModal();

    // and THEN do the standard mount stuff
    super.componentDidMount();
  }

  componentWillReceiveProps(nextProps) {
    this.renderModal(nextProps);
  }

  componentWillUpdate(nextProps) {}

  componentDidUpdate(prevProps) {
    super.componentDidUpdate(...arguments);
  }

  componentWillUnmount() {
    if (this.$modal) this.$modal.remove();
  }


  //////////////////////////////
  // Syntactic sugar
  //////////////////////////////


  //////////////////////////////
  // SUI Modal Module Properties
  //////////////////////////////

  static moduleProps = moduleProps;

  tellModule(...args) {
    this.$modal.modal(...args);
  }

  setModuleProps(props) {
    super.setModuleProps(props);
  }

  //////////////////////////////
  // SUI Modal Module Behaviors
  //////////////////////////////

  toggle() { return this.tellModule("toggle") }
  show() { return this.tellModule("show") }
  hide() { return this.tellModule("hide") }
  hideAll() { return this.tellModule("hide all") }
  hideOthers() { return this.tellModule("hide others") }

  isActive() { return this.tellModule("is active") }
  setActive() { return this.tellModule("set active") }

  showDimmer() { return this.tellModule("show dimmer") }
  hideDimmer() { return this.tellModule("hide dimmer") }

  refresh() { return this.tellModule("refresh") }
  cacheSizes() { return this.tellModule("cache sizes") }
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

  static ACTION_NAME_TO_CLASS_MAP = {
    ok: "approve",
    save: "approve",
    cancel: "cancel"
  }

  renderStringAction(title) {
    // special case class
    const className = this.constructor.ACTION_NAME_TO_CLASS_MAP[title.toLowerCase()];
    return <Button title={title} className={className}/>;
  }

  // Render the actual contents of the modal
  // Split out because we need to render it in a special place -- see componentDidMount
  renderModal(props = this.props) {
    const {
      id, className, style,
      header, content, actions, children,
      appearance, size, fullscreen
    } = props;

    const elements = new ElementBuffer({
      props : {
        id,
        style,
        className: [className, "ui", appearance, size, { fullscreen }, "modal"]
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

//////////////////////////////
//
//	<Dimmer> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import { classNames } from "oak-roots/util/react";
import { autobind } from "oak-roots/util/decorators";

import ElementBuffer from "./ElementBuffer";
import SUIModuleComponent from "./SUIModuleComponent";

import "./Dimmer.css";

const moduleProps = {
  opacity: PropTypes.any,               // default: "auto"      Dimmers opacity from 0-1. Defaults to auto which uses the CSS specified opacity
  variation: PropTypes.string,          // default: false       Specify a variation to add when generating dimmer, like inverted
  dimmerName: PropTypes.any,            // default: false	      If initializing a dimmer on a dimmable context, you can use dimmerName to distinguish between multiple dimmers in that context.
  on: PropTypes.any,                    // default: false	      Can be set to hover or click to show/hide dimmer on dimmable event
  useCSS: PropTypes.bool,               // default: true	      Whether to dim dimmers using CSS transitions.
  duration: PropTypes.object,           // default: (object)    Animation duration of dimming. If an integer is used, that value will apply to both show and hide animations.
  transition: PropTypes.string,         // default: "fade"	    Named transition to use when animating menu in and out. Fade and slide down are available without including ui transitions

  // We take these over to work with React.
  // TODO: is this really necessary?
//  closable: PropTypes.any,            // default: auto	      Whether clicking on the dimmer should hide the dimmer (Defaults to auto, closable only when settings.on is not hover)
//  onChange: PropTypes.func,           // Args:	              Callback on element show or hide
//  onShow: PropTypes.func,             // Args:	              Callback on element show
//  onHide: PropTypes.func,             // Args:	              Callback on element hide
}


const Dimmer = class SUIDimmer extends SUIModuleComponent {
  static defaultProps = {
    visible: false
  }

  static propTypes = {
    content: PropTypes.string,
    icon: PropTypes.string,
    iconAppearance: PropTypes.string,

    appearance: PropTypes.string,         // page, blurring, inverted, simple

    // We take over the following properties from the module...
    closable: PropTypes.bool,             // If true, clicking the dimmer hides it.
    onChange: PropTypes.func,               // Fired when dimmer is shown
    onShow: PropTypes.func,               // Fired when dimmer is shown
    onHide: PropTypes.func                // Fired when dimmer is hidden
  };


  //////////////////////////////
  // Component lifecycle
  //////////////////////////////

  componentDidMount() {
    super.componentDidMount();

    const { visible } = this.props;
    this.updateDisabled();
    if (visible) this.show()
  }

  componentDidUpdate(prevProps) {
    super.componentDidUpdate();

    const { disabled, visible } = this.props;

    // update disabled on the component
    this.updateDisabled();

    // if visibility actually changed, or doesn't agree with SemanticUI's interpretation,
    // show/hide the dimmer
    if (visible !== prevProps.visible || visible !== this.isActive()) {
      if (visible)  this.show();
      else          this.hide();
    }
  }


  //////////////////////////////
  // SUI Dimmer Module Properties
  //////////////////////////////

  static moduleProps = moduleProps;

  tellModule(...args) {
    return this.$ref().dimmer(...args);
  }


  //////////////////////////////
  // SUI Dimmer Module Behaviors
  //////////////////////////////

  addContent(element) { this.tellModule("add content", element); return this; }

//  toggle() { this.tellModule("toggle"); return this; }
//  show() { this.tellModule("show"); return this; }
  hide() { this.tellModule("hide"); return this; }
  create() { this.tellModule("create"); return this; }

  isActive() { return this.tellModule("is active"); }
  setActive() { this.tellModule("set active"); return this; }

  isDimmer() { return this.tellModule("is dimmer"); }
  setDimmer() { this.tellModule("set dimmed"); return this; }

  setDisabled() { this.tellModule("set disabled"); return this; }
  isDisabled() { return this.tellModule("is disabled"); }
  isEnabled() { return this.tellModule("is enabled"); }

  isPage() { return this.tellModule("is page"); }
  isPageDimmer() { return this.tellModule("is page dimmer"); }
  setPageDimmer() { this.tellModule("set page dimmer"); return this; }

  isDimmable() { return this.tellModule("is dimmable"); }
  setDimmable() { this.tellModule("set dimmable"); return this; }
  getDimmer() { return this.tellModule("get dimmer"); }
  hasDimmer() { return this.tellModule("has dimmer"); }

  isAnimating() { return this.tellModule("is animating"); }
  getDuration() { return this.tellModule("get duration"); }
  setOpacity(opacity) { this.tellModule("set opacity", opacity); return this; }


  //////////////////////////////
  // Our additions to SUI Module Behaviors
  //////////////////////////////

  // Tell semanticUI to show the dimmer with the visual effect.
  // Also fires our `onShow` and/or `onChange` events.
  show() {
    const { appearance, onShow, onChange } = this.props;

    // if we're blurring, our parent must have the "blurring" class
    // NOTE: this will get undone on a repaint of the parent...  :-(
    if (appearance && appearance.includes("blurring")) {
      const $parent = this.$ref().parent();
      if (!$parent.hasClass("blurring")) {
        console.info("Adding .blurring to dimmer parent ", $parent);
        $parent.addClass("blurring");
      }
    }

    // "set active" is necessary if dimmer has been enabled/disabled
    this.setActive()
        .tellModule("show");

    if (onShow) onShow();
    if (onChange) onChange();
  }

  hide() {
    const { onHide, onChange } = this.props;
    this.tellModule("hide");
    if (onHide) onHide();
    if (onChange) onChange();
  }

  toggle() {
    if (this.isActive()) return this.show();
    return this.hide();
  }

  // Update disabled on the element to match our props.
  updateDisabled() {
    const { disabled } = this.props;
    this.$ref().toggleClass("disabled", !!disabled);
  }


  //////////////////////////////
  // Event handling
  //////////////////////////////

  @autobind
  onClick(event) {
    const { disabled, visible, onClick, closable } = this.props;
    if (disabled) return;

    // if we have an onClick, fire that first
    if (onClick) onClick(event, this);

    // if the default got prevented, stop here
    if (event.defaultPrevented) return;

    // if we are closable and we're visible, hide!
    if (closable && visible) {
      this.hide();
    }
  }

  //////////////////////////////
  // Rendering
  //////////////////////////////

  render() {
    // Non-overridable properties
    const {
      id, style,
      content, icon, iconAppearance, children,
      className, appearance="", closable,
      disabled, visible
    } = this.props;

    // derived properties
    const inverted = appearance.includes("inverted");

    let elements = new ElementBuffer({
      props: {
        ...this.getUnknownProps(),
        id,
        style,
        className: ["ui", className, appearance, /*{ closable } */, "dimmer"],
        onClick: this.onClick
      }
    });
    // add icon first
    if (icon) elements.appendIcon(icon, iconAppearance);

    // add contents and text-only children
    if (content) elements.append(content);
    if (typeof children === "string") elements.append(children);


    // wrap in a header element if any of the above was specified
    if (!elements.isEmpty) {
      const headerClasses = ["ui", { icon, inverted: !inverted }, "header"];
      elements.wrap("h2", { className: headerClasses });
    }
    // add non-text-only children here (outside of the header element)
    if (children && typeof children !== "string") elements.append(children);

    // if we have children, wrap them in <div.content><div.center/></div>
    if (elements.length) {
      elements.wrap("div", { className: "center" });
      elements.wrap("div", { className: "content" });
    }

    return elements.render();
  }
}

export default Dimmer;

//////////////////////////////
//
//	<Dimmer> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";
import { autobind } from "core-decorators";

import ElementBuffer from "./ElementBuffer";
import SUIComponent from "./SUIComponent";
import Icon from "./Icon";

import "./Dimmer.css";

const Dimmer = class SUIDimmer extends SUIComponent {
  static defaultProps = {
    ...SUIComponent.defaultProps,
    visible: false
  }

  static propTypes = {
    ...SUIComponent.propTypes,

    content: PropTypes.string,
    icon: PropTypes.string,
    iconAppearance: PropTypes.string,

    appearance: PropTypes.string,         // page, blurring, inverted, simple

    closable: PropTypes.bool,             // If true, clicking the dimmer hides it.

    onShow: PropTypes.func,               // Fired when dimmer is shown
    onHide: PropTypes.func                // Fired when dimmer is hidden
  };


  //////////////////////////////
  // Component lifecycle
  //////////////////////////////

  componentDidMount() {
    if (!this.disabled && this.visible) this.onVisibleChange();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.disabled) return;

    const { prevVisible, prevDisabled } = this.get(["visible", "disabled"], prevProps, prevState);
    if (this.visible !== prevVisible || this.disabled !== prevDisabled) {
      this.onVisibleChange();
    }
  }

  // Invoke dimmer routies when visiblity changes
  onVisibleChange() {
    const { appearance = "", onShow, onHide } = this.props;
    // set up closable and events
    const $element = this.$ref();
    $element.dimmer();

    // if we're blurring, our parent must have the "blurring" class
    // NOTE: this will get undone on a repaint of the parent...  :-(
    if (appearance.includes("blurring")) {
      const $parent = $element.parent();
      if (!$parent.hasClass("blurring")) {
        console.warn("Adding .blurring to dimmer parent ", $parent);
        $parent.addClass("blurring");
      }
    }

    if (this.visible) {
      $element.dimmer("show").addClass("active");
      if (onShow) onShow(this);
    }
    else {
      $element.removeClass("active").dimmer("hide");
      if (onHide) onHide(this);
    }
  }

  //////////////////////////////
  // Event handling
  //////////////////////////////

  @autobind
  onClick(event) {
    if (this.disabled) return;

    // if we have an onClick, fire that first
    const { onClick, closable } = this.props;
    if (onClick) onClick(event, this);

    // if the default got prevented, stop here
    if (event.defaultPrevented) return;

    // if we are closable and we're visible, hide!
    if (closable && this.visible) this.visible = false;
  }

  //////////////////////////////
  // Rendering
  //////////////////////////////

  render() {
    // Non-overridable properties
    const {
      id, style,
      content, icon, iconAppearance, children,
      className, appearance="", closable
    } = this.props;

    // State-overridable properties
    const { disabled, onClick } = this;

    // derived properties
    const inverted = appearance.includes("inverted");

    let elements = new ElementBuffer({
      props: {
        ...this.getUnknownProperties(),
        id,
        style,
        className: ["ui", className, appearance, { disabled, closable }],
        onClick: this.onClick
      }
    });
    // add contents and text-only children
    if (content) elements.append(content);
    if (typeof children === "string") elements.append(children);
    // add icon BEFORE the above
    if (icon) elements.prepend(<Icon icon={icon} appearance={iconAppearance}/>);

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

    // add "dimmer" at the end of the className
    elements.addClass("dimmer");
    return elements.render();
  }
}

export default Dimmer;

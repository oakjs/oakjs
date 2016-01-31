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
    const { visible } = this.props;

    this.$setDisabled();
    if (visible) this.$showDimmer()
  }

  componentDidUpdate(prevProps) {
    const { disabled, visible } = this.props;

    // update disabled on the component
    this.$setDisabled();

    // if visibility actually changed, or doesn't agree with SemanticUI's interpretation,
    // show/hide the dimmer
    if (visible !== prevProps.visible || visible !== this.$isActive()) {
      if (visible)  this.$showDimmer();
      else          this.$hideDimmer();
    }
  }

  // Does Semantic UI think the dimmer is showing?
  $isActive() {
    return this.$ref().dimmer("is active");
  }

  // Update disabled on the element to match our props.
  $setDisabled() {
    const { disabled } = this.props;
    this.$ref().toggleClass("disabled", !!disabled);
  }

  // Tell semanticUI to show the dimmer with the visual effect.
  // Also fires our `onShow` and/or `onChange` events.
  $showDimmer() {
    const { onShow, onChange, appearance="" } = this.props;

    const $element = this.$ref();

    // if we're blurring, our parent must have the "blurring" class
    // NOTE: this will get undone on a repaint of the parent...  :-(
    if (appearance.includes("blurring")) {
      const $parent = $element.parent();
      if (!$parent.hasClass("blurring")) {
        console.warn("Adding .blurring to dimmer parent ", $parent);
        $parent.addClass("blurring");
      }
    }

    // "set active" is necessary if dimmer has been enabled/disabled
    $element
      .dimmer("set active")
      .dimmer("show");

    if (onShow) onShow(this);
    if (onChange) onChange(this);
  }

  // Tell semanticUI to hide the dimmer with the visual effect.
  // Also fires our `onHide` and/or `onChange` events.
  $hideDimmer() {
    const { onHide, onChange } = this.props;

    this.$ref().dimmer("hide");
    if (onHide) onHide(this);
    if (onChange) onChange(this);
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
      this.$hideDimmer();
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
        ...this.getUnknownProperties(),
        id,
        style,
        className: ["ui", className, appearance, /*{ closable } */],
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

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

const Dimmer = class SUIDimmer extends SUIComponent {
  static defaultProps = {
    visible: false
  }

  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,

    visible: PropTypes.bool,
    disabled: PropTypes.bool,

    content: PropTypes.string,
    icon: PropTypes.string,
    iconAppearance: PropTypes.string,
    children: PropTypes.any,

    appearance: PropTypes.string,         // page, blurring, inverted, simple

    closable: PropTypes.bool,             // If true, clicking the dimmer hides it.

    onShow: PropTypes.func,               // Fired when dimmer is shown
    onHide: PropTypes.func                // Fired when dimmer is hidden
  };

  //////////////////////////////
  // Component lifecycle
  //////////////////////////////

  componentDidMount() {
    // if we're blurring and visible, do an onVisibleChange to get the blur effect
    const { disabled, visible, appearance="" } = this.props;
    if (!disabled && visible) this.onVisibleChange();
  }

  componentDidUpdate(prevProps) {
    const { disabled, visible } = this.props;
    // if we're not disabled and our `visible` has changed
    if (!disabled && visible !== prevProps.visible) {
      this.onVisibleChange();
    }
  }

  //////////////////////////////
  // Event handling
  //////////////////////////////

  onVisibleChange() {
    const { visible, closable, appearance = "", onShow, onHide } = this.props;
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

    if (visible) {
      $element.dimmer("show");
      if (onShow) onShow(this);
    }
    else {
      $element.dimmer("hide");
      if (onHide) onHide(this);
    }
  }

  @autobind
  onClick(event) {
    const { disabled, onClick } = this.props;
    if (!disabled && onClick) {
      onClick(event, this);
    }
  }

  //////////////////////////////
  // Rendering
  //////////////////////////////

  render() {
    const {
      id, style,
      content, icon, iconAppearance, children,
      className, appearance="",
      visible, disabled
    } = this.props;

    let elements = new ElementBuffer();
    // add contents and text-only children
    if (content) elements.append(content);
    if (typeof children === "string") elements.append(children);
    // add icon BEFORE the above
    if (icon) elements.prepend(<Icon icon={icon} appearance={iconAppearance}/>);

    // wrap in a header element if any of the above was specified
    if (elements.length) {
      elements.className = ["ui", { icon, inverted: !appearance.includes("inverted") }, "header"];
      elements.wrap("h2");
    }
    // add non-text-only children here (outside of the header element)
    if (children && typeof children !== "string") elements.append(children);

    // if we have children, wrap them in <div.content><div.center/></div>
    if (elements.length) {
      elements.wrap("div", { className: "center" });
      elements.wrap("div", { className: "content" });
    }

    elements.props = {
      ...this.getExtraProperties(),
      id,
      style,
      className: ["ui", className, appearance, { disabled }, "dimmer"],
      onClick: this.onClick
    }
    return elements.render();
  }
}

export default Dimmer;

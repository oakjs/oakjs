//////////////////////////////
//
//	<Dimmer> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";
import { autobind } from "core-decorators";

import ElementBuffer from "./ElementBuffer";
import OverrideableComponent from "./OverrideableComponent";
import Icon from "./Icon";

const Dimmer = class SUIDimmer extends OverrideableComponent {
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
    super.componentDidMount();
    this.setUpDimmer();
    if (this.get("visible")) this.onShow();
  }

  componentDidChangeState(deltas) {
    if ("visible" in deltas) {
      if (deltas.visible) this.onShow();
      else                this.onHide();
    }
  }

  setUpDimmer() {
    // set up closable and events
    const $dimmer = this.$ref();
    $dimmer.dimmer({ active: this.get("visible"), closable: this.get("closable") });

    // if we're blurring, our parent must have the "blurring" class
    // NOTE: this will get undone on a repaint of the parent...  :-(
    const appearance = this.get("appearance") || "";
    if (appearance && appearance.includes("blurring")) {
      const $parent = $dimmer.parent();
      if (!$parent.hasClass("blurring")) {
        console.warn("Adding .blurring to dimmer parent ", $parent);
        $parent.addClass("blurring");
      }
    }
  }

  // Called when we've just been shown, but not generally in initial draw.
  onShow() {
    this.setUpDimmer();
    const $dimmer = this.$ref();
//    if ($dimmer.dimmer("is active")) return;

    $dimmer.dimmer("show");
    const onShow = this.get("onShow");
    if (onShow) onShow(this);

//    if (this.get("id")) this.constructor.trigger(this.get("id"), "onShow", this);
  }

  // Called when we've just been hidden, but not generally on initial draw.
  onHide() {
    this.setUpDimmer();
    const $dimmer = this.$ref();
//    if (!$dimmer.dimmer("is active")) return;

    $dimmer.dimmer("hide");
    const onHide = this.get("onHide");
    if (onHide) onHide(this);

//    if (this.get("id")) this.constructor.trigger(this.get("id"), "onHide", this);
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
    } = this.getAll();

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
      className: ["ui", className, appearance, { disabled, active: visible }, "dimmer"]
    }
    return elements.render();
  }
}

export default Dimmer;

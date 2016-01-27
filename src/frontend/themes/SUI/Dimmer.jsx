//////////////////////////////
//
//	<Dimmer> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";
import { autobind } from "core-decorators";

import { generateId, addElements, addElementsOn } from "./SUI";
import SUIComponent from "./SUIComponent";
import registeredComponent from "./registeredComponent";
import visibleComponent from "./visibleComponent";
import Icon from "./Icon";

const Super = visibleComponent(SUIComponent);
const Dimmer = class SUIDimmer extends Super {
  static defaultProps = {
    ...Super.defaultProps,
    visible: false
  }
  static propTypes = {
    ...Super.propTypes,
    className: PropTypes.string,
    style: PropTypes.object,

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

  setUpDimmer() {
    const { appearance, closable } = this.props;

    // set up closable and events
    const $dimmer = this.$ref();
    $dimmer.dimmer({ closable });

    // if we're blurring, our parent must have the "blurring" class
    // NOTE: this will get undone on a repaint of the parent...  :-(
    if (appearance && appearance.includes("blurring")) {
      const $parent = $dimmer.parent();
      if (!$parent.hasClass("blurring")) {
        console.warn("Adding .blurring to dimmer parent ", $parent);
        $parent.addClass("blurring");
      }
    }
  }

  onShow() {
    this.setUpDimmer();
    const $dimmer = this.$ref();
    $dimmer.dimmer("show");
    if (this.props.onShow) this.props.onShow(this);
  }

  onHide() {
    this.setUpDimmer();
    const $dimmer = this.$ref();
    $dimmer.dimmer("hide");
    if (this.props.onHide) this.props.onHide(this);
  }

  //////////////////////////////
  // Rendering
  //////////////////////////////

  render() {
    const {
      id, style,
      // content
      content, icon, iconAppearance, children,
      // appearance
      className, appearance="",
    } = this.props;

    let elements = [];
    // add contents and text-only children
    if (content) elements = addElements(elements, content);
    if (typeof children === "string") elements = addElements(elements, children);
    // add icon BEFORE the above
    if (icon) elements = addElements(<Icon icon={icon} appearance={iconAppearance}/>, elements);

    // wrap in a header element if any of the above was specified
    if (elements.length) {
      const contentProps = {
        className: classNames("ui", { icon:icon, inverted: !appearance.includes("inverted") }, "header")
      };
      elements = [ React.createElement("h2", contentProps, ...elements) ];
    }
    // add non-text-onlu children here (outside of the header element)
    if (children && typeof children !== "string") elements = addElements(elements, children);

    // if we have children, wrap them in <div.content><div.center/></div>
    if (elements.length) {
      elements = [ <div className="content">{ React.createElement("div", { className: "center" }, ...elements) }</div> ]
    }

    // class name bits
    const classProps = {
      disabled: this.isDisabled,
      active: this.isVisible,
    }

    const dimmerProps = {
      ...this.getExtraProperties(),
      id,
      style,
      className: classNames("ui", className, appearance, classProps, "dimmer")
    }
    return React.createElement("div", dimmerProps, ...elements);
  }
}

export default Dimmer;

//////////////////////////////
//
//  <Oak.FixedPanel> component
//
//  Renders children inside a `position:fixed` panel so they pop out.
//
//  TODO: copy id / styles / className to the popout???
//
//////////////////////////////

import { Children, Component, PropTypes } from "react";
import ReactDOM from "react-dom";

import { classNames, unknownProps } from "oak-roots/util/react";

import OakComponent from "./OakComponent";
import AutoResized from "./AutoResized";

import "./FixedPanel.less";

export default class FixedPanel extends AutoResized(OakComponent) {
  static propTypes = {
    ...OakComponent.propTypes,

    // FixedPanel appearance:  "inverted"
    appearance: PropTypes.string,

    // explicit width/height of the outer div
    width: PropTypes.any,
    height: PropTypes.any,

    // Properties to apply to the popout
    popoutProps: PropTypes.any
  }

  // When window is resized, size our `popout` to the same size as our root element.
  onResize(rootElement) {
//console.info(`${this}.onResize`);
    // transfer the size of the root element to our `popout`
    const $root = $(rootElement);
    const size = $root.offset();
    if (!size) return;

    size.width = $root.outerWidth();
    size.height = $root.outerHeight();

    this.$ref("popout").css(size);
  }

  render() {
    if (this.hidden) return null;

    const { appearance, className, height, id, popoutProps, style, width } = this.props;

    const wrapperProps = {
      id,
      className: classNames("oak", appearance, "FixedPanel", className),
      style: { ...style, width, height },
      ...unknownProps(this.props, this.constructor)
    }

    return (
      <div {...wrapperProps}>
        <div {...popoutProps} ref="popout">
          {this.props.children}
        </div>
      </div>
    );
  }

}

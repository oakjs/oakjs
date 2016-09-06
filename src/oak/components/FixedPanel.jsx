//////////////////////////////
//
//  <Oak.FixedPanel> component
//
//  Renders children inside a `position:fixed` panel so they pop out.
//
//////////////////////////////

import { Children, Component, PropTypes } from "react";
import ReactDOM from "react-dom";

import fn from "oak-roots/util/fn";
import { classNames, unknownProps } from "oak-roots/util/react";

import OakComponent from "./OakComponent";

import "./FixedPanel.less";

export default class FixedPanel extends OakComponent {
  static propTypes = {
    ...OakComponent.propTypes,

    // FixedPanel appearance:  "inverted"
    appearance: PropTypes.string,

    // explicit width/height of the outer div
    width: PropTypes.any,
    height: PropTypes.any
  }

  componentDidMount() {
    super.componentDidMount();
    this.setPanelSize();
  }

  componentDidUpdate() {
    super.componentDidUpdate();
    this.setPanelSize();
  }

  setPanelSize() {
    // transfer the css of the root element to our `popout`
    const $root = this.$ref();
    const style = $root.offset();
    style.width = $root.outerWidth();
    style.height = $root.outerHeight();

    this.$ref("popout").css(style);
  }

  render() {
    if (this.hidden) return null;

    const { appearance, className, height, id, width, style } = this.props;

    const wrapperProps = {
      id,
      className: classNames("oak", appearance, "FixedPanel", className),
      style: { ...style, width, height },
      ...unknownProps(this.props, this.constructor)
    }

    return (
      <div {...wrapperProps}>
        <div className="popout" ref="popout">
          {this.props.children}
        </div>
      </div>
    );
  }

}

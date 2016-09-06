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
import { classNames, mergeProps, stringOrFn, boolOrFn } from "oak-roots/util/react";

import OakComponent from "./OakComponent";

import "./FixedPanel.less";

export default class FixedPanel extends OakComponent {
  static propTypes = {
    ...OakComponent.propTypes,

    // fixedPanel appearance
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
    // get the size of our root element
    const $root = this.$ref();
    const size = $root.offset();
    size.width = $root.outerWidth();
    size.height = $root.outerHeight();

    // transfer the offset size of the root element to our `popout`
    this.$ref("popout").css(size);
  }

  render() {
    if (this.hidden) return null;

    const { appearance, width, height, children, ...props } = this.props;
    return (
      <div className={classNames("oak", appearance, "FixedPanel")} style={{ width, height }}>
        <div {...props} ref="popout">
          {children}
        </div>
      </div>
    );
  }

}

//////////////////////////////
//
//	<Oak-FixedPanel> component
//
//  Renders children inside a `position:fixed` panel so they pop out.
//
//////////////////////////////

import { Children, Component, PropTypes } from "react";
import ReactDOM from "react-dom";

import fn from "oak-roots/util/fn";
import { classNames, mergeProps, stringOrFn, boolOrFn } from "oak-roots/util/react";

import Hideable from "./Hideable";

import "./FixedPanel.less";

export default class FixedPanel extends Hideable {
  static propTypes = {
    ...Hideable.propTypes,

    // explicit width/height of the outer div
    width: PropTypes.any,
    height: PropTypes.any
  }

  componentDidMount() {
    this.setPanelSize();
  }

  componentDidUpdate() {
    this.setPanelSize();
  }

  setPanelSize() {
    const $root = $(ReactDOM.findDOMNode(this));
    const $popout = $(ReactDOM.findDOMNode(this.refs.popout));

    // transfer the offset size of the root element to the popout
    const size = $root.offset();
    size.width = $root.outerWidth();
    size.height = $root.outerHeight();

    $popout.css(size);
  }

  render() {
    const { width, height, children, ...props } = this.props;
    return (
      <div className="oak FixedPanel" style={{ width, height }}>
        <div {...props} ref="popout">
          {children}
        </div>
      </div>
    );
  }

}

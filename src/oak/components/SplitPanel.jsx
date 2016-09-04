//////////////////////////////
//
//	<Oak-SplitPanel> component for use with oak e.g.:
//
//    <Oak-SplitPanel>
//      <Some-Element/>
//      <Some-Other-Element/>
//    </Oak-SplitPanel>
//
//  NOTE: only works with TWO internal components
//
//
//  TODO:
//  - `resizable`
//      - add a splitter div
//      - remember sizes somehow
//
//////////////////////////////

import { Children, Component, PropTypes } from "react";
import ReactDOM from "react-dom";

import fn from "oak-roots/util/fn";
import { classNames, mergeProps, stringOrFn, boolOrFn } from "oak-roots/util/react";

import Hideable from "./Hideable";

import "./SplitPanel.less";

export default class SplitPanel extends Hideable {
  static propTypes = {
    ...Hideable.propTypes,

    // direction? e.g. direction="vertical" means divide panel up into vertical chunks.
    direction: PropTypes.oneOf(["horizontal","vertical"]),

    // Do we automatically set up scrolling in the panes?
    scrolling: PropTypes.bool,

    // Can the user resize the panes?
    resizable: PropTypes.bool,

    // Ratio of components, eg: `[ "50%", "50%" ]` or `[ 30, "100%" ]`
    sizes: PropTypes.array
  }

  static defaultProps = {
    direction: "vertical",
    resizable: false,
    sizes: [ "50%", "50%" ]
  }


  componentDidMount() {
    this.setChildSizes();
  }

  componentDidUpdate() {
    this.setChildSizes();
  }

  setChildSizes() {
    const { direction, sizes } = this._props;
    if (!sizes) return;

    const $root = $(ReactDOM.findDOMNode(this));
    const $children = $root.children(":not(.oak.Splitter)");

    sizes.forEach( (size, index) => {
      const child = $children[index];
      if (!child) return;

      const flex = (typeof size === "number" ? 0 : 1);
      const sizeString = (typeof size === "number" ? `${size}px` : size);

      child.style.flex = `${flex} ${flex} ${sizeString}`;
    });
  }

  mungeChildren(props) {
    const { resizable, scrolling } = props;
    let children = Children.toArray(props.children);

    // if scrolling, wrap children in a "Scroller" div
    if (scrolling) {
      children = children.map( child => <div className="oak Scroller">{child}</div> );
    }

    // if resizable, interleave <Splitter> divs.
    if (resizable) {
      const interleaved = children.map( (child, index) => {
        if (index === 0) return child;
        return [<div className="oak Splitter"/>, child];
      });
      children = [].concat(...interleaved);
    }

    return children;
  }

  getRenderProps() {
    const props = super.getRenderProps();
    let { direction, resizable, scrolling } = props;

    // Add standard classNames to those passed in with `props`
    props.className = classNames(
      "oak",
      { scrolling, resizable },
      direction,
      "SplitPanel",
      props.className
    );

    props.children = this.mungeChildren(props);

    return props;
  }

  render() {
    this._props = this.getRenderProps();
    if (this._props.hidden) return null;
    // remove props we don't want to apply to main element
    const { direction, children, hidden, scrolling, sizes, ...elementProps } = this._props;
    return React.createElement("div", elementProps, ...children);
  }

}

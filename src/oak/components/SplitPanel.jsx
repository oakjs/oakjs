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
//////////////////////////////

import { Children, Component, PropTypes } from "react";

import fn from "oak-roots/util/fn";
import { classNames, mergeProps, stringOrFn, boolOrFn } from "oak-roots/util/react";

import Hideable from "./Hideable";

import "./SplitPanel.less";

export default class SplitPanel extends Hideable {
  static propTypes = {
    ...Hideable.propTypes,

    // horizontal? vertical?  NOTE: there can be only one...
    vertical: PropTypes.bool,           // DEFAULT is vertical
    horizontal: PropTypes.bool,

    // Can the user resize the two panes?
    resizable: PropTypes.bool,

    // Ratio of first component to second component, eg: .25 = 25% component 1, 75% component two.
// TODO: `sizes` so we can have > 2 children?
    ratio: PropTypes.number
  }

  static defaultProps = {
    resizable: true,
    ratio: .5
  }


  componentDidMount() {
    this.setRatio();
  }

  componentDidUpdate() {
    this.setRatio();
  }

  setRatio() {
console.warn("TODO: set ratio of children!!!");
  }


  mungeChildren(props) {
    const children = Children.toArray(props.children);
    // If no children,
    if (!children) {
      return [];
    }
    // otherwise if we don't have exactly 2 kids, complain and don't insert the splitter
    else if (children.length !== 2) {
      console.warn("<SplitPanel> should have exactly two children");
      return children;
    }
    else {
      return [
        children[0],
        <div className="splitter"/>,
        children[1]
      ];
    }
  }

  getRenderProps() {
    const props = super.getRenderProps();
    let { horizontal, vertical, resizable } = props;

    // there can be only one
    if (vertical) horizontal = false;
    else if (horizontal) vertical = false;
    else vertical = true;

    props.className = classNames(
      "oak",
      { horizontal, vertical, resizable },
      "SplitPanel",
      props.className
    );

    props.children = this.mungeChildren(props);

    return props;
  }

  render() {
    const { children, hidden, ...props } = this.getRenderProps();
    if (hidden) return null;

    return React.createElement("div", props, ...children);
  }

}

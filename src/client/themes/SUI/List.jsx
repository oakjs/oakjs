//////////////////////////////
//
//	<List> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "oak-roots/util/react";

import { getFloatedClass } from "./constants";

function SUIList(props) {
  const {
    // allow for different tag names to be used (default is "div")
    tagName,
    // content
    children,
    // appearance
    className, appearance, size, floated,
    // state & events
    hidden, disabled,
    // everything else including id and style
    ...ListProps
  } = props;

  ListProps.className = classNames(
      className, "ui", appearance, size,
      getFloatedClass(floated),
      { hidden, disabled },
      "list"
    );

  return React.createElement(tagName, ListProps, children);
}

SUIList.defaultProps = {
  tagName: "div"
}

SUIList.propTypes = {
  tagName: PropTypes.string,            // eg: "div" or "ol" etc
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,

  appearance: PropTypes.string,         // bulleted, ordered, link, horizontal, inverted, selection, animated, relaxed, divided, celled
  size: PropTypes.string,               // `mini`, `tiny`, `small`, `medium`, `large`, `big`, `huge`, `massive`
  floated: PropTypes.string,            // `left` or `right`

  hidden: PropTypes.bool,
  disabled: PropTypes.bool,
};

// add render() method so we get hot code reload.
SUIList.render = Function.prototype;

export default SUIList;

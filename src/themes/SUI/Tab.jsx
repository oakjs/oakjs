//////////////////////////////
//
//	<Tab> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";

import { getAttachedClass, getOppositeAttachedClass } from "./constants";
import ElementBuffer from "./ElementBuffer";

function SUITab(props, context) {
  const {
    className,
    name, title, icon, content, children,
    appearance, attached,
    active, loading,
    // everything else including id, style
    ...extraProps
  } = props;

  // figure out attached class
  let attachedClass = getAttachedClass(attached);
  // if we weren't told, check with our tabs
  if (!attachedClass) {
    const barOn = (context.tabs && context.tabs.props.barOn) || "top";
    attachedClass = getOppositeAttachedClass(barOn);
  }

  const elements = new ElementBuffer({
    props : {
      ...extraProps,
      className: [ className, "ui", { active, loading }, appearance, attachedClass, "tab segment" ],
      "data-tab": name
    }
  });

  if (content) elements.append(content);
  if (children) elements.append(children);

  return elements.render();
}

SUITab.contextTypes = {
  tabs: PropTypes.any
}

SUITab.defaultProps = {}

SUITab.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,

  name: PropTypes.string,         // value
  title: PropTypes.any,           // title to appear in tabbar, can be element(s)
  icon: PropTypes.any,            // icon for title
  content: PropTypes.any,         // alternative to children
  children: PropTypes.any,        //

  appearance: PropTypes.string,   //
  attached: PropTypes.string,     // "top" or "bottom", will attempt to derive if not specified

  active: PropTypes.bool,
  loading: PropTypes.bool,
};

// add render() method so we get hot code reload.
SUITab.render = Function.prototype;

export default SUITab;

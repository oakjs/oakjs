//////////////////////////////
//
//	<Step> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";

import ElementBuffer from "./ElementBuffer";
import Icon from "./Icon";

import "./Step.css";

function SUIStep(props) {
  const {
    id, className, style,
    title, description, icon, link, target, children,
    appearance,
    active, disabled, completed,
    ...otherProps
  } = props;

  const elements = new ElementBuffer({
    // use an anchor if we have a link
    type: (link ? "a" : "div"),
    props : {
      ...otherProps,
      id,
      style,
      className: [className, appearance, { link, active, disabled, completed }, "step"],
      href: link,
      target: target
    }
  });

  if (title) elements.append(<div className="title">{title}</div>);
  if (description) elements.append(<div className="description">{description}</div>);
  // wrap in a div.content
  if (!elements.isEmpty) {
    elements.wrap("div", { className: "contents" });
  }
  // add children at the end (unwrapped)
  if (children) elements.append(children);

  // add icon at the front
  if (icon) elements.prepend(<Icon icon={icon}/>);

  return elements.render();
}

SUIStep.defaultProps = {}

SUIStep.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,

  title: PropTypes.string,
  description: PropTypes.string,
  icon: PropTypes.string,

  link: PropTypes.string,
  target: PropTypes.string,

  appearance: PropTypes.string,

  active: PropTypes.bool,
  completed: PropTypes.bool,
  disabled: PropTypes.bool
};

// add render() method so we get hot code reload.
SUIStep.render = Function.prototype;

export default SUIStep;

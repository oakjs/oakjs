//////////////////////////////
//
//	<Reveal> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";

import { hasClass } from "./SUI";
import ElementBuffer from "./ElementBuffer";
import "./Reveal.css";


function SUIReveal(props) {
  const {
    className,
    // content
    children,
    // appearance
    effect, appearance, size,
    // state & events
    active, disabled,
    // everything else including id, style
    ...extraProps
  } = props;

  const elements = new ElementBuffer({
    props: {
      ...extraProps,
      className: [className, "ui", effect, appearance, { active, disabled }, "reveal"]
    }
  });

window.children = children;
  // we only output the first two children
  // and we assume the first is "visible" and the second is "hidden"
  const visibleChild = (Array.isArray(children) ? children[0] : children);
  if (visibleChild) {
    if (hasClass(visibleChild, "visible content")) {
      elements.append(visibleChild);
    }
    else {
      elements.appendWrapped("div", "visible content", visibleChild);
    }
  }

  const hiddenChild = (Array.isArray(children) ? children[1] : undefined);
  if (hiddenChild) {
    if (hasClass(hiddenChild, "hidden content")) {
      elements.append(hiddenChild);
    }
    else {
      elements.appendWrapped("div", "hidden content", hiddenChild);
    }
  }

  return elements.render();
}

SUIReveal.defaultProps = {
  effect: "fade"
}

SUIReveal.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,

  children: PropTypes.array,            // gotta have an array of children, yo!

  effect: PropTypes.string,             // "fade", "move", "move right", "move left", "move up", "move down", "rotate", "rotate left"
  appearance: PropTypes.string,         // "circular"
  size: PropTypes.string,               // `mini`, `small`, `medium`, `large`

  active: PropTypes.bool,
  disabled: PropTypes.bool,
};

// add render() method so we get hot code reload.
SUIReveal.render = Function.prototype;

export default SUIReveal;

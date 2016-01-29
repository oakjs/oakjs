//////////////////////////////
//
//	<Reveal> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";

import ElementBuffer from "./ElementBuffer";
import "./Reveal.css";


function SUIReveal(props) {
  const {
    id, style, className,
    // content
    content, children,
    // appearance
    effect, appearance, size,
    // state & events
    active, disabled,
    // everything else including id, style, href, target
    ...revealProps
  } = props;

  const elements = new ElementBuffer({
    props: {
      id,
      style,
      className: [className, "ui", effect, appearance, { active, disabled }, "reveal"]
    }
  });
  if (content) elements.append(content);
  if (children) elements.append(children);

  return elements.render();
}

SUIReveal.defaultProps = {
  effect: "fade"
}

SUIReveal.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,

  content: PropTypes.string,            // alternative to children

  effect: PropTypes.string,             // "fade", "move", "move right", "move left", "move up", "move down", "rotate", "rotate left"
  appearance: PropTypes.string,         // "circular"
  size: PropTypes.string,               // `mini`, `small`, `medium`, `large`

  active: PropTypes.bool,
  disabled: PropTypes.bool,
};

// add render() method so we get hot code reload.
SUIReveal.render = Function.prototype;

export default SUIReveal;

//////////////////////////////
//
//	<Loader> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";

import ElementBuffer from "./ElementBuffer";

function SUILoader(props) {
  const {
    // content
    content, children,
    // appearance
    className, appearance, size,
    // state & events
    visible, disabled, active, indeterminate,
    // everything else including id, style, href, target
    ...loaderProps
  } = props;

  const elements = new ElementBuffer({
    props: {
      className: [className, "ui", appearance, size, { disabled, active, indeterminate }, "loader"]
    }
  });
  if (content || children) {
    elements.append(content, children);
    elements.addClass("text");
  }
  return elements.render();
}

SUILoader.defaultProps = {
  visible: true
}

SUILoader.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,

  content: PropTypes.string,      // alternative to children

  appearance: PropTypes.string,   // inline
  size: PropTypes.string,         // `mini`, `small`, `medium`, `large`

  visible: PropTypes.bool,
  disabled: PropTypes.bool,
  active: PropTypes.bool,
  indeterminate: PropTypes.bool,
};

// add render() method so we get hot code reload.
SUILoader.render = Function.prototype;

export default SUILoader;

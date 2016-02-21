import React, { PropTypes } from "react";
import classNames from "oak-roots/util/react";

import InfoHint from "./InfoHint";

import "./Cropper.css";

function Cropper(props, context) {
  const { width, height, children, showOnHover, ...cropperProps } = props;

  cropperProps.className = classNames("Cropper", cropperProps.className, { showOnHover });
  cropperProps.style = Object.assign({ width, height }, cropperProps.style);

  return (
    <div {...cropperProps}>{children}</div>
  );
}

// Add `render` method so we'll get hot reload
Cropper.render = Function.prototype;

export default Cropper;

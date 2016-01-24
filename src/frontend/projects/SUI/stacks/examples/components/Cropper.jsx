import React, { PropTypes } from "react";
import classNames from "classnames";

import InfoHint from "./InfoHint";

import "./Cropper.css";

function Cropper(props, context) {
  const { width, height, children, ...cropperProps } = props;

  cropperProps.className = classNames("Cropper", cropperProps.className);
  cropperProps.style = Object.assign({ width, height }, cropperProps.style);

  return (
    <div {...cropperProps}>{children}</div>
  );
  const c = context.components;
  return (
    <div className="Cropper">
      <c.Spacer size="small"/>
      <c.Header size="medium" dividing>
        {props.title}
        {props.hint && <c.InfoHint text={props.hint}/>}
      </c.Header>
      {props.children}
      <c.Spacer size="huge"/>
    </div>
  );
}

// Add `render` method so we'll get hot reload
Cropper.render = Function.prototype;

export default Cropper;

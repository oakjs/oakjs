"use strict";
//////////////////////////////
//
//  <Form> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import { classNames } from "oak-roots/util/react";

import SUIComponent from "./SUIComponent";
import ElementBuffer from "./ElementBuffer";

import "./Form.css";

const Form = class SUIForm extends SUIComponent {

  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,

    appearance: PropTypes.string,   // "equal width", "inverted"
    size: PropTypes.string,         // "small", "medium", "large"

    state: PropTypes.string,        // "success", "error", "warning"
    loading: PropTypes.bool,

    // should (?) catch events sent to our children?
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,

  };

  //////////////////////////////
  //  Event handling
  //////////////////////////////

  onFocus = (event) => {
    console.warn("form got onFocus():", arguments);
    const { onFocus } = this.props;
    if (onFocus) onFocus(event, this);
  };

  onBlur = (event) => {
    console.warn("form got onBlur():", arguments);
    const { onBlur } = this.props;
    if (onBlur) onBlur(event, this);
  };

  onChange = (event) => {
    console.warn("form got onChange():", arguments);
    const { onChange } = this.props;
    if (onChange) onChange(event, this);
  };

  //////////////////////////////
  //  Rendering
  //////////////////////////////

  render() {
    const {
      id, className, style,
      children,
      appearance, size,
      state, loading
    } = this.props;

    const elementProps = {
      ...this.getUnknownProps(),
      id,
      style,
      className: classNames("ui", state, appearance, size, { loading }, "form"),
      onFocus: this.onFocus,
      onBlur: this.onBlur,
      onChange: this.onChange,
    }
    return <form {...elementProps}>{children}</form>;
  }

}
export default Form;

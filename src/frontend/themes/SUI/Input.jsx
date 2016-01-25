
"use strict";

//////////////////////////////
//
//  <Input> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";
import { autobind } from "core-decorators";

import SUIComponent from "./SUIComponent";
import Label from "./Label";
import Popup from "./Popup";
import { renderIcon } from "./Icon";

import "./Input.css";

//////////////////////////////
//  Rendering helpers you can call statically
//////////////////////////////

// Return the default label location for a specified input type
export function defaultLabelOn({ type }) {
  if (type === "radio" || type === "checkbox") return "right";
  return undefined;
}

// Return the default label location for a specified input type
export function defaultLabelAppearance({ type }) {
  if (type === "radio" || type === "checkbox") return "transparent";
  return undefined;
}

// Render label specified by props and the inputElement.
// Returns an ARRAY of elements in the correct order (with no wrapping element).
export function renderLabel(props, inputElements) {
  const { label, type } = props;
  if (!label) return inputElements;

  // Checkbox and radio buttons labels should wrap the element so we can click the label.
  if (type === "checkbox" || type === "radio") {
    return renderWrappingLabel(props, inputElements);
  }
  return renderAdjacentLabel(props, inputElements);
}

export function renderAdjacentLabel(props, inputElements) {
  const { label, type, labelOn = defaultLabelOn(props), labelAppearance = defaultLabelAppearance(props)} = props;
  const labelProps = {
    className: classNames("ui", labelAppearance, "label")
  }
  const labelElement = <label {...labelProps}>{label}</label>;
  if (labelOn === "right") {
    return [...inputElements, labelElement];
  }
  return [labelElement, ...inputElements];
}

export function renderWrappingLabel(props, inputElements) {
  const { label, type, labelOn = defaultLabelOn(props), labelAppearance = defaultLabelAppearance(props)} = props;
  if (!label) return inputElements;
  const labelProps = {
    className: classNames("ui", labelAppearance, "label")
  }

  let elementsWithLabel;
  if (labelOn === "right") {
    elementsWithLabel = [...inputElements, typeof label === "string" ? " " + label : label];
  }
  else {
    elementsWithLabel = [typeof label === "string" ? label + " " : label, ...inputElements];
  }
  return [
    React.createElement("label", labelProps, ...elementsWithLabel)
  ]
}

export function renderError(props) {
  const { error, showError } = props;
  if (!error || error === true) return [];
  return [<Popup appearance="red">{error}</Popup>];
  return [<br/>, <div className="ui red pointing above label">{error}</div>];
}


export default class SUIInput extends SUIComponent {
  static defaultProps = {
    type: "text",
    showError: true,
    iconOn: "right",
//    labelOn: "left",
//    labelAppearance: "basic"
  };

  static propTypes = {
    // standard
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,

    // states
    hidden: PropTypes.bool,
    disabled: PropTypes.bool,
    focused: PropTypes.bool,
    loading: PropTypes.bool,
    error: PropTypes.string,
    showError: PropTypes.bool,

    // appearance
    appearance: PropTypes.string,       // transparent, inverted, fluid
    size: PropTypes.string,             // mini, small, medium, large, big, huge, massive
    icon: PropTypes.string,
    iconOn: PropTypes.string,           // left, right

    label: PropTypes.string,
    labelOn: PropTypes.string,          // left, right
    labelAppearance: PropTypes.string,  // basic, tag, etc

    // input attributes
    type: PropTypes.string,         // text, password, hidden, etc
    value: PropTypes.any,
    placeholder: PropTypes.string,
    childrenOn: PropTypes.string,       // left, right

    // event handlers
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,       // NOTE: fires every keystroke!
  };

  //////////////////////////////
  //  Lifecycle
  //////////////////////////////

  constructor(props) {
    super(...arguments);
console.info("constructed with value ",props.value);
    // Push `value` passed in into state
    this.state = {
      value: props.value
    };
  }

  //////////////////////////////
  //  Get/set current value
  //////////////////////////////
  get value() {
    return this.state.value;
  }
  set value(newValue) {
    this.setState({value: newValue});
  }

  //////////////////////////////
  //  Event handling
  //////////////////////////////
  @autobind
  onFocus(event) {
    if (this.props.onFocus) this.props.onFocus(event, this);
  }

  @autobind
  onBlur(event) {
    if (this.props.onBlur) this.props.onBlur(event, this);
  }

  @autobind
  onChange(event) {
    const value = event.target.value;
console.info("onChange to ", value);
    this.setState({ value });
    if (this.props.onChange) this.props.onChange(event, value, this);
  }


  //////////////////////////////
  //  Rendering helpers you can call on the instance
  //////////////////////////////
  defaultLabelOn() { return defaultLabelOn(this.props) }
  defaultLabelAppearance() { return defaultLabelAppearance(this.props) }
  renderLabel(inputElements) { return renderLabel(this.props, inputElements) }
  renderError() { return renderError(this.props) }


  //////////////////////////////
  //  Rendering
  //////////////////////////////

  render() {
    const {
      id, className, style,
      hidden, disabled, focused, loading, error, showError,
      appearance, size, icon, iconOn, label, labelOn, labelAppearance,
      type, value, placeholder,
      children, childrenOn,
      onChange, onFocus, onBlur,
      // everything else goes directly on the input
      ...extraInputProps
    } = this.props;

    // TODO: detect if there's a label or icon child?

    const classMap = {
      disabled,
      hidden,
      focus: focused,
      loading,
      error,
    };

    const inputProps = {
      ...extraInputProps,
      type,
      value: this.value,
      placeholder,
      disabled,
      onChange: this.onChange,
      onFocus: this.onFocus,
      onBlur: this.onBlur,
    };
    const inputElement = <input {...inputProps}/>;
    let elements = [inputElement];

    // render icon
    if (icon) {
      const iconElement = renderIcon(icon);
      classMap[`${iconOn} icon`] = true;
      if (iconOn === "left") {
        elements = [iconElement, ...elements];
      } else {
        elements = [...elements, iconElement];
      }
    }

    if (label) {
      elements = this.renderLabel(elements);

      if (labelOn) {
        classMap[`${labelOn} labeled`] = labelOn;
      }
      else {
        classMap.labeled = true;
      }
    }


    // render error message
    if (error) {
      elements = [...elements, ...this.renderError()];
    }

    // add any children to the end of the elements
    if (children) {
      if (childrenOn === "left")
        elements = (children.concat ? children : [children]).concat(elements);
      else
        elements = elements.concat(children);
    }

    // render container
    const containerProps = {
      id,
      className: classNames(className, "ui", size, appearance, classMap, "input"),
      style,
    };

    return React.createElement("div", containerProps, ...elements);
  }
}

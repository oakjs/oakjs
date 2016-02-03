
"use strict";

//////////////////////////////
//
//  <Input> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";
import { autobind } from "core-decorators";

import ElementBuffer from "./ElementBuffer";
import SUIComponent from "./SUIComponent";
import Label from "./Label";
import Popup from "./Popup";
import Icon from "./Icon";

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

// Return the default labelWraps for a specified input type
export function defaultLabelWraps({ type }) {
  return (type === "radio" || type === "checkbox");
}

// Render label specified by props and adds to the `elements` passed in.
// Returns `true` if a label was added.
export function renderLabel(props, elements) {
  const { label, type } = props;
  if (!label) return false;
  const labelWraps = defaultLabelWraps(props);

  if (labelWraps) return renderWrappingLabel(props, elements);
  return renderAdjacentLabel(props, elements);
}

export function renderAdjacentLabel(props, elements) {
  const { label, type, labelOn = defaultLabelOn(props), labelAppearance = defaultLabelAppearance(props)} = props;
  if (!label) return false;

  const labelProps = {
    className: classNames("ui", labelAppearance, "label")
  }
  const labelElement = <label {...labelProps}>{label}</label>;
  elements.addOn(labelOn, labelElement);
  return true;
}

export function renderWrappingLabel(props, elements) {
  const { label, type, labelOn = defaultLabelOn(props), labelAppearance = defaultLabelAppearance(props)} = props;
  if (!label) return false;

  const labelProps = {
    className: classNames("ui", labelAppearance, "label")
  }

  if (labelOn === "right") {
    // add an explicit space or React will jam things together
    elements.append(typeof label === "string" ? " " + label : label);
  }
  else {
    elements.prepend(typeof label === "string" ? label + " " : label);
  }
  elements.wrap("label", labelProps);
  return true;
}

export function renderError(props, elements) {
  const { error, showError } = props;
  if (error && typeof error !== true && showError) {
    elements.append(<Popup appearance="red">{error}</Popup>);
    return true;
  }
}


export default class SUIInput extends SUIComponent {
  static defaultProps = {
    type: "text",
    showError: true,
    iconOn: "right",
    childrenOn: "right"
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
    error: React.PropTypes.oneOfType([
      PropTypes.bool,                     // `true` = above
      PropTypes.string,                   // `left`, `right`, `above`, `below`, `up`, `down`
    ]),
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

    children: PropTypes.any,
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

    // Push `value` passed in into state
    // We'll continue to manage it in state until it changes in props (see `componentWillUpdate()`).
    if (!this.state) this.state = {};
    this.state.value = this.props.value;
  }

  // On update, if the `value` PROPERTY changed on update, change our `state.value` to match it.
  // This will account for, eg, a form changing the object that it's looking at.
  componentWillUpdate(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState(newValue);
    }
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
//console.info("onChange to ", value);
    this.setState({ value });
    if (this.props.onChange) this.props.onChange(event, value, this);
  }

  //////////////////////////////
  //  Rendering
  //////////////////////////////

  render() {
    const {
      id, className, style,
      appearance, size, icon, iconOn,
      label, labelOn,
      type, placeholder,
      children, childrenOn,
      hidden, disabled, focused, loading, error, showError,
    } = this.props;
    const { value } = this.state;

    const elements = new ElementBuffer({
      props: {
        id,
        style,
        className: [ className, "ui", appearance, size, { disabled, hidden, focus:focused, loading, error } ]
      }
    });

    const inputProps = {
      // send all unknown props to the input, not the wrapper
      ...this.getUnknownProps(),
      placeholder,
      disabled,
      onChange: this.onChange,
      onFocus: this.onFocus,
      onBlur: this.onBlur,
    };

    if (type === "textarea") {
      elements.append(<textarea {...inputProps}>{value}</textarea>);
    }
    else {
      inputProps.type = type;
      inputProps.value = value;
      elements.append(<input {...inputProps}/>);
    }

    // Render icon.
    if (icon) {
      elements.addIconOn(iconOn, icon);
      elements.addClass(`${iconOn || ""} icon`);
    }

    // Render label.
    // Note that label may wrap the element, depending on `labelWraps` or `type` props.
    if (label) {
      const labelAdded = renderLabel(this.props, elements);
      if (labelAdded) elements.addClass(`${labelOn || ""} labeled`);
    }

    // add any children passed in on the appropriate side
    if (children) elements.addOn(childrenOn, children);

    // render error message at the very end
    if (error) renderError(this.props, elements);

    // add "input" class at the very end to be all semantical
    elements.addClass("input");
    return elements.render();
  }
}


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

export function renderError(elements, error) {
  if (error && typeof error !== "boolean") {
    elements.append(<Popup appearance="red">{error}</Popup>);
    return true;
  }
}

export default class SUIInput extends SUIComponent {
  static defaultProps = {
    type: "text",
    iconOn: "right",
    childrenOn: "right",
    labelWraps: "auto"
  };

  static propTypes = {
    // standard
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,

    // states
    hidden: PropTypes.bool,
    readonly: PropTypes.bool,
    disabled: PropTypes.bool,
    focused: PropTypes.bool,
    loading: PropTypes.bool,
    error: React.PropTypes.oneOfType([
      PropTypes.bool,                     // `true` = above
      PropTypes.string,                   // `left`, `right`, `above`, `below`, `up`, `down`
    ]),

    // appearance
    appearance: PropTypes.string,       // transparent, inverted, fluid
    size: PropTypes.string,             // mini, small, medium, large, big, huge, massive
    icon: PropTypes.string,
    iconOn: PropTypes.string,           // left, right

    leftLabel: PropTypes.any,           // label to show on left of element
    rightLabel: PropTypes.any,          // label to show on right of element
    labelAppearance: PropTypes.string,
    labelWraps: PropTypes.any,          // "auto" = if checkbox or radio

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
      this.setState({ value: this.props.value });
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

  // Should a label of a particular type wrap the element?
  labelShouldWrapElement(side) {
    const { labelWraps, type } = this.props;
    if (typeof labelWraps === "boolean") return labelWraps;
    if (labelWraps === "auto") return (type === "radio" || type === "checkbox");
    if (labelWraps === "left" && side === "left") return true;
    if (labelWraps === "right" && side === "right") return true;
    return false;
  }

  // Render label specified by props and adds to the `elements` passed in.
  // Returns `true` if a label was added.
  renderLabel(elements, label, side) {
    if (!label) return false;

    const { labelAppearance } = this.props;

    if (this.labelShouldWrapElement(side)) {
      elements.addOn(side, label);
      const labelClass = classNames(labelAppearance, `${side} wrapped`);
      // wrap in a <label> to get click behavior
      elements.wrap("label", labelClass);
      // wrap in a span to avoid SUI rendering problem
      elements.wrap("span");
    }
    else {
      const labelClass = classNames("ui", labelAppearance, "label");
      const labelElement = elements.createWrapped("label", labelClass, label);
      elements.addOn(side, labelElement);
    }
    return true;
  }


  renderLeftLabel(elements) {
    const { leftLabel } = this.props;
    const labelAdded = this.renderLabel(elements, leftLabel, "left");
    if (labelAdded) elements.addClass("left labeled");
  }

  renderRightLabel(elements) {
    const { rightLabel } = this.props;
    const labelAdded = this.renderLabel(elements, rightLabel, "right");
    if (labelAdded) elements.addClass("right labeled");
  }

  renderError(elements) {
    const { error } = this.props;
    return renderError(elements, error);
  }

  render() {
    const {
      id, className, style,
      appearance, size, icon, iconOn,
      type, placeholder,
      children, childrenOn,
      hidden, readonly, disabled, focused, loading, error,
    } = this.props;
    const { value } = this.state;

    const elements = new ElementBuffer({
      props: {
        id,
        style,
        className: [ className, "ui", { disabled, readonly, hidden, focus:focused, loading, error }, appearance, size ]
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

    if (disabled) inputProps.disabled = true;
    // grrrr... react calls this "readOnly"
    if (readonly) {
      inputProps.readOnly = true;
      // Browsers allow the user to change readonly checkboxen and radio buttons
      if (type === "checkbox" || type === "radio") {
        inputProps.disabled = true;
      }
    }

    if (type === "textarea") {
      elements.append(<textarea {...inputProps}>{value}</textarea>);
    }
    else {
      inputProps.type = type;
      inputProps.value = value;
      elements.append(<input {...inputProps}/>);
    }

    // Render icon, which must go INSIDE the label if label wraps
    if (icon) {
      elements.addIconOn(iconOn, icon);
      elements.addClass(`${iconOn || ""} icon`);
    }

    // render labels, which might wrap the element
    this.renderLeftLabel(elements);
    this.renderRightLabel(elements);

    // add any children passed in on the appropriate side
    if (children) elements.addOn(childrenOn, children);

    // render error message at the very end
    if (error) this.renderError(elements);

    // add "input" class at the very end to be all semantical
    elements.addClass("input");
    return elements.render();
  }
}

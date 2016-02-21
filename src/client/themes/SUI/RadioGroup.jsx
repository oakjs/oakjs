
"use strict";

//////////////////////////////
//
//  <RadioGroup> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "oak-roots/util/react";
import { autobind } from "oak-roots/util/decorators";

import ElementBuffer from "./ElementBuffer";
import SUIComponent from "./SUIComponent";

import RadioButton from "./RadioButton";
import Fields from "./Fields";
import Field from "./Field";

//////////////////////////////
//  Rendering helpers you can call statically
//////////////////////////////


export default class SUIRadioGroup extends SUIComponent {
  static defaultProps = {
    grouped: true
  }

  static propTypes = {
    value: PropTypes.any,
    options: PropTypes.any,               // map of { value: label }

    children: PropTypes.any,              // NOTE: shouldn't have these!

    // TODO... ???
    focused: PropTypes.bool,

    // event handlers
    onChange: PropTypes.func
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
  //  Syntactic sugar
  //////////////////////////////
  get value() { return this.state.value; }
  set value(value) { this.setState({ value }) };

  //////////////////////////////
  //  Event handling
  //////////////////////////////


  getOnChangeFunction(buttonValue) {
    return () => {
      // update the value
      this.value = buttonValue;
      // call onChange if defined
      const { onChange } = this.props;
      if (onChange) onChange.call(this, buttonValue);
    }
  }

  //////////////////////////////
  //  Rendering
  //////////////////////////////

  renderOption(value, label) {
    const buttonProps = {
      label,
      checked: (value === this.value),
      onChange: this.getOnChangeFunction(value)
    }
    return <Field><RadioButton {...buttonProps}/></Field>;
  }

  renderOptions() {
    const { options } = this.props;
    if (!options) {
      console.warn(this,".renderOptions(): no options provided!");
      return;
    }

    return Object.keys(options).map( value => this.renderOption(value, options[value]) );
  }

  render() {
    const {
      options,
      children,
    } = this.props;

    const { value } = this.state;

    if (children) throw new TypeError("SUI.Embed.render():  child elements are not supported!");

    const elements = new ElementBuffer({
      type: Fields,
      props: {
        ...this.getUnknownProps(),
      }
    });
    elements.addClass("RadioGroup");

    elements.append(this.renderOptions());

    return elements.render();
  }
}

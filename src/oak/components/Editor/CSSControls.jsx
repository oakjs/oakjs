//////////////////////////////
// Editor.Control subclasses for dealing with CSS values
//
// TODO: select input on initial re-render after changing from auto -> num|value
// TODO: <Editor-Number> which rejects any non-number keystrokes + paste ???
// TODO: !important ???
//////////////////////////////

import React, { PropTypes } from "react";

import Control from "./Control";
import { HTMLSelect } from "./Select";

// Control which renders a <Number> and <Select> to both evaluate to a numeric value with units.
//
//  TODO: make the whole thing selectable / focused at the same time
//  TOOD: show the units in an output
//  TODO: remember units in state?
export class NumericUnitControl extends Control {
	static propTypes = {
    ...Control.propTypes,

    // Array of discrete string values, eg: `[ "auto", "inherits", etc ]`
    stringValues: PropTypes.arrayOf(PropTypes.string),

    // Array of unit values, eg: `[ "px", "%", "em", etc ]`
    unitValues: PropTypes.arrayOf(PropTypes.string).isRequired,

// TODO: min/max ?

    // Default units to use if we get a value + no units.
    defaultUnits: PropTypes.string,
  }

  static splitParser = /^([+-]?(?:\d+(?:\.\d*)?|\.\d+))(.*)$/;

  // Split the value into:
  //  - `undefined`
  //  - `{ string }` eg for `auto`, `inherits`, etc from fixed part of regex
  //  - `{ number, units }`
  //  - `{ error, value }`
  splitValue(value = this._props && this._props.value) {
    const { stringValues, unitValues } = this._props;

    if (typeof value === "string") value = value.trim();
    if (value === undefined || value === "") return undefined;

    const split = { value };

    if (typeof value === "number") {
      split.number = value;
      return split;
    }

    if (typeof value !== "string") {
      console.warn(`${this.constructor.name}.splitValue(): dont know how to parse:`, value);
      split.error = `Invalid value: '${value}'`;
      return split;
    }

    // if it's one of the specified `stringValues`, just return that.
    if (stringValues && stringValues.includes(value)) {
      split.string = value;
      return split;
    }

    // Match against our numeric `<number><units string>` parser
    const parserMatch = value.match(this.constructor.splitParser);
    if (!parserMatch) {
      split.error = `Invalid value: '${value}'`;
      return split;
    }

    // get the bits from the parser match
    let [ fullMatch, number, units ] = parserMatch;

    // if units don't match unitValues, show an error
    if (units && !unitValues.includes(units)) {
      split.hint = `Don't understand '${units}'`;
      // Tell them first first which starts with that value
      // TODO: fill it in for them?
      const firstMatch = unitValues.filter( unitValue => unitValue.startsWith(units) )[0];
      if (firstMatch) split.hint += `, did you mean '${firstMatch}'?`;
      return split;
    }

    split.number = parseFloat(number) || 0;
    split.units = units;
    return split;
  }

  onUnitsChanged(event) {
    const lastValue = this.splitValue();
    const { name, stringValues } = this._props;

    const fieldValue = event.target.value;
    let value;
    if (!fieldValue) {
      value = undefined;
    }
    else if (stringValues.includes(fieldValue)) {
      value = fieldValue;
    }
    else {
      value = (lastValue && lastValue.number || 0) + fieldValue;
    }
//console.warn("onUnitsChanged", fieldValue, value);
    this.context.form.onChange(event, this, name, value);
  }

  onNumberChanged(event) {
    const { name, defaultUnits } = this._props;
    const lastValue = this.splitValue();
    const fieldValue = event.target.value;

    const split = this.splitValue(fieldValue);
    let value;
    if (split && split.number) {
      value = "" + split.number + (split.units || lastValue && lastValue.units || defaultUnits);
    }
    else if (split && split.string) {
      value = split.string;
    }
    else {
      value = fieldValue;
    }
//console.warn("onNumberChanged", fieldValue, value);
    this.context.form.onChange(event, this, name, value);
  }

  renderControl(props) {
    const { stringValues, unitValues, defaultUnits } = props;
    const controlProps = this.getControlProps(props);

    let inputValue = props.value || "", selectValue = "";
    const split = this.splitValue(props.value);

    if (split) {
      // if we got an error back, pass the error up to the control
      if (split.error) props.error = split.error;
      if (split.hint) props.hint = split.hint;
      if ("number" in split) {
        inputValue = split.number;
        selectValue = split.units || defaultUnits;
      }
    }

    // TODO: cache options for class?
    const options = (stringValues && unitValues && [...stringValues, "-", ...unitValues ])
                  || stringValues
                  || unitValues;
    return (
      <span>
        <input {...controlProps} className="right-attached" value={inputValue} autoFocus={split && split.error} type="text" style={{width:"8em"}} onChange={(event)=>this.onNumberChanged(event)}/>
        <HTMLSelect {...controlProps} tabIndex="-1" className="left-attached" value={selectValue} options={options} onChange={(event)=>this.onUnitsChanged(event)}/>
      </span>
    );
  }
}

// EITHER:  `""` / `undefined`
//     OR:  `"auto"
//     OR:  `"<number><lengthType>"`
export class CSSLength extends NumericUnitControl {
  static defaultProps = {
    stringValues: [ "auto" ],
    unitValues: [ "px", "%", "em", "rem", "vh", "vw", "vmin", "vmax" ],
    defaultUnits: "px"
  }
}

// export all as one map
export default Object.assign({}, exports);

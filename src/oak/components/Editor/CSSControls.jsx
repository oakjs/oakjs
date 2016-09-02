//////////////////////////////
// Editor.Control subclasses for dealing with CSS values
//
// TODO: select input on initial re-render after changing from auto -> num|value
// TODO: <Editor-Number> which rejects any non-number keystrokes + paste ???
// TODO: !important ???
//////////////////////////////

import React, { PropTypes } from "react";

import Control, { Text } from "./Control";
import { HTMLSelect } from "./Select";

//import "./css.less";



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

    if (typeof value === "number") {
      return { number: value };
    }

    if (typeof value !== "string") {
      console.warn(`${this.constructor.name}.splitValue(): dont know how to parse:`, value);
      return { error: `1-Invalid value: '${value}'`, value };
    }

    // if it's one of the specified `stringValues`, just return that.
    if (stringValues && stringValues.includes(value)) return { string: value };

    // Construct a regex parser on the fly
    // TODO: cache the parsers???
    const parserMatch = value.match(this.constructor.splitParser);
    if (!parserMatch) {
      return { error: `2-Invalid value: '${value}'`, value };
    }
    let [ fullMatch, number, units ] = parserMatch;

    // if units don't match unitValues, show an error
    // TODO: default to the first which starts with that value?
    if (units && !unitValues.includes(units)) {
      const firstMatch = unitValues.filter( unitValue => unitValue.startsWith(units) )[0];
      if (firstMatch) {
        units = firstMatch;
      }
      else {
        return { error: `2-Invalid units: '${units}'`, value };
      }
    }

    return {
      number: parseFloat(number) || 0,
      units
    }
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
    const current = this.splitValue();
    const fieldValue = event.target.value;

    const split = this.splitValue(fieldValue);
    let value;
    if (split && split.number) {
      value = "" + split.number + (split.units || current && current.units || defaultUnits);
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

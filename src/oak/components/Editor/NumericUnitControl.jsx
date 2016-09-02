//////////////////////////////
// Editor.NumericUnitControl
//  renders a <Number> and <Select> to both evaluate to a numeric value with units.
//
// TODO: make the whole thing look selectable / focused at the same time
// TODO: prettier (would involve being able to explicitly select text after typing)
// TODO: select input on initial re-render after changing from auto -> num|value
// TODO: min/max ?
// TODO: typeahead to select firstMatch with units
//////////////////////////////

import React, { PropTypes } from "react";

import Control from "./Control";
import { HTMLSelect } from "./Select";

export default class NumericUnitControl extends Control {
	static propTypes = {
    ...Control.propTypes,

    // Logical name of this type, for error messages
    typeName: PropTypes.string,

    // Array of discrete string values, eg: `[ "auto", "inherits", etc ]`
    // NOTE: strin values are NOT REQUIRED
    stringValues: PropTypes.arrayOf(PropTypes.string),

    // Array of unit values, eg: `[ "px", "%", "em", etc ]`
    // NOTE: units are REQUIRED
    unitValues: PropTypes.arrayOf(PropTypes.string).isRequired,

    // Default units to use if we get a value + no units.
    defaultUnits: PropTypes.string,
  }

  static splitParser = /^([+-]?(?:\d+(?:\.\d*)?|\.\d+))(.*)$/;

  // Split the value into:
  //  - `undefined`
  //  - `{ value, string }` eg for `auto`, `inherits`, etc from fixed part of regex
  //  - `{ value, number, units }`
  //  - `{ value, error }`
  splitValue(value = this._props && this._props.value) {
    const { typeName, stringValues, unitValues, defaultUnits } = this._props;

    if (typeof value === "string") value = value.trim();
    if (value === undefined || value === "") return undefined;

    const split = { value };

    if (typeof value === "number") {
      split.number = value;
      return split;
    }

    if (typeof value !== "string") {
      console.warn(`${this.constructor.name}.splitValue(): dont know how to parse:`, value);
      split.error = `Invalid ${typeName}`;
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
      split.error = `Invalid ${typeName}`;
      return split;
    }

    // get the bits from the parser match
    let [ fullMatch, number, units ] = parserMatch;

    // if units don't match unitValues, show an error
    if (units && !unitValues.includes(units)) {
      split.error = `"${units}" is not valid`;
      // Tell them first first which starts with that value
      // TODO: fill it in for them?
      const firstMatch = unitValues.filter( unitValue => unitValue.startsWith(units) )[0];
      if (firstMatch) split.error += `, did you mean "${firstMatch}"?`;
      else if (defaultUnits) split.error += `, maybe you want "${defaultUnits}"?`;
      return split;
    }

    split.number = parseFloat(number) || 0;
    split.units = units;
    return split;
  }

  // Custom `onChange` handler for both `<input>` and `<select>` change events.
  onChange(props, controlHandler, event) {
    // current value of the field that changed
    const fieldValue = event.target.value;

    const lastSplit = props.split;

    // figure out the new value we'll save for the field
    let newValue = fieldValue;

    const numberChanged = event.target.tagName.toUpperCase() === "INPUT";
    if (numberChanged) {
      const newSplit = this.splitValue(fieldValue);
      if (newSplit && newSplit.number) {
        const units = newSplit.units || lastSplit && lastSplit.units || props.defaultUnits;
        newValue = "" + newSplit.number + units;
      }
    }
    // units changed
    else {
      if (!fieldValue) {
        newValue = undefined;
      }
      else if (props.unitValues.includes(fieldValue)) {
        const number = (lastSplit && lastSplit.number) || 0;
        newValue = "" + number + fieldValue;
      }
    }

//    console.warn("NUC onChange", fieldValue, newValue);
		return this._handleEvent("onChange", props, controlHandler, event, newValue);
  }

  // Add `split` value to the normalized props.
  normalizeProps() {
    const props = super.normalizeProps();
    const split = props.split = this.splitValue(props.value);
    // push error / hint up to props
    if (split) {
      if (split.error && !props.error) props.error = split.error;
      if (split.hint && !props.hint) props.hint = split.hint;
    }

    // normalize select options
    // TODO: cache options for class?
    props.options = (props.stringValues && props.unitValues && [...props.stringValues, "-", ...props.unitValues ])
                  || props.stringValues
                  || props.unitValues;
    return props;
  }


  renderControl(props) {
    const controlProps = this.getControlProps(props);

    let inputValue = props.value || "";
    let selectValue = "";

    if (props.split && "number" in props.split) {
      inputValue = props.split.number;
      selectValue = props.split.units || props.defaultUnits;
    }

    return (
      <span {...controlProps} className={classNames(controlProps.className, "combobox")}>
        <input className="right-attached" value={inputValue} type="text" onChange={(event)=>true}/>
        <HTMLSelect tabIndex="-1" className="left-attached" value={selectValue} options={props.options} onChange={(event)=>true}/>
      </span>
    );
  }
}

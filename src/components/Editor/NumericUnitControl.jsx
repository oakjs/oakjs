//////////////////////////////
// Editor.NumericUnitControl
//  renders a <Number> and <Select> to both evaluate to a numeric value with units.
//
// TODO: make this a dynamic combobox-type thing
// TODO: put full text into field (involves explicitly selecting text after typing)
// TODO: select input on initial re-render after selecting units value
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

    // INCLUSIVE Min/max values
    min: PropTypes.number,
    max: PropTypes.number
  }

  // Generic split parser:  `<number><units>`
  static splitParser = /^([+-]?(?:\d+(?:\.\d*)?|\.\d+))(.*)$/;

  // Split the value into:
  //  - `undefined`
  //  - `{ value, string }` eg for `auto`, `inherits`, etc from fixed part of regex
  //  - `{ value, number, units }`
  //  - `{ value, error }`
  splitValue(_value, props) {
    // convert to a string value
    let value = _value;
    if (typeof value === "string") value = value.trim();
    else if (typeof value === "number") value = "" + value;

    if (value === null || value === undefined || value === "") return undefined;

    if (typeof value !== "string") {
      console.warn(`${this.constructor.name}.splitValue(): dont know how to parse:`, value);
      return { error: `Invalid ${props.typeName}` };
    }

    // if it's one of the specified `stringValues`, just return that.
    if (props.stringValues && props.stringValues.includes(value)) {
      return { string: value };
    }

    // Match against our numeric `<number><units string>` parser
    const parserMatch = value.match(this.constructor.splitParser);
    if (!parserMatch) {
      return { error: `Invalid ${props.typeName}` };
    }

    // get the bits from the parser match
    let [ fullMatch, number, units ] = parserMatch;

    // if units don't match unitValues, show an error
    if (units && !props.unitValues.includes(units)) {
      let error = `"${units}" is not valid`;
      // Tell them first first which starts with that value
      // TODO: fill it in for them?
      const firstMatch = props.unitValues.filter( unitValue => unitValue.startsWith(units) )[0];
      if (firstMatch) error += `, did you mean "${firstMatch}"?`;
      else if (props.defaultUnits) error += `, maybe you want "${props.defaultUnits}"?`;

      return { error };
    }

    // make sure min < number < max
    number = parseFloat(number) || 0;
    let error = undefined;
    if ("min" in props && number < props.min) {
      error = `${props.typeName || "value"} must be at least ${props.min}`;
    }
    if ("max" in props && number > props.max) {
      error = `${props.typeName || "value"} must be no more than ${props.max}`;
    }

    return { number, error, units };
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
      const newSplit = this.splitValue(fieldValue, props);
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
    // Figure out split value
    const split = props.split = this.splitValue(props.value, props);
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

// Make everything draggable but not droppable
import { editify } from "oak/EditorProps";
editify("Editor", { draggable: true, droppable: false }, NumericUnitControl);

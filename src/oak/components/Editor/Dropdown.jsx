//////////////////////////////
// Editor.Dropdown class
//
//	Select
//
//////////////////////////////

import React, { PropTypes } from "react";

import { debounce } from "oak-roots/util/decorators";

import SUIDropdown from "themes/SUI/Dropdown";

import Control from "./Control";

// "<Dropdown>" Control subclass based on <SUI-Dropdown>.
export default class Dropdown extends Control {
	// Add <Select> specific propTypes
	static propTypes = {
		...Control.propTypes,
		"enum": PropTypes.any,								// List of valid `enum` values from JSON schema.
		options: PropTypes.any,								// Specifier for HTML options, overides `enum`.

		allowAdditions: PropTypes.bool,       // allow additions to pre-set values?
		multiple: PropTypes.bool,							// multi-select?
		search: PropTypes.bool, 							// search-style: allows them to type
		selection: PropTypes.bool,  					// looks like a <select>

		delimiter: PropTypes.string,          // Delimiter for multiple options specified as string
	}

	static defaultProps = {
	  selection: true,
	  delimiter: ","
	}

	// Properties passed to control.
	static controlProps = [
		...Control.controlProps, "allowAdditions", "items", "multiple", "search", "selection"
	];


  // Return true if 2 values are the same.
  // Arrays will be joined
  valuesAreTheSame(value1, value2, delimiter) {
    if (Array.isArray(value1)) value1 = value1.join(delimiter);
    if (Array.isArray(value2)) value2 = value2.sort().join(delimiter);
    return value1 === value2;
  }

  getCurrentValue(props) {
    const value = super.getCurrentValue(props);
    return this.normalizeValue(value, props.multiple, props.delimiter);
  }

  // Normalize `value` according to `multiple`
  //  - value is `null/undefined/""`, return `undefined`
  //  - if `multiple` is `true`, we'll always return a NEW array (splitting by `delimiter` if necessary)
  //  - otherwise we'll return the value passed in.
  normalizeValue(value, multiple, delimiter) {
    if (value === null || value === undefined || value === "") return undefined;
    if (multiple) {
      if (Array.isArray(value)) return [...value];
      if (typeof value === "string") return value.split(delimiter);
      return [value];
    }
    return value;
  }

  // Custom event for dropdown change which we pass up to the control.
  onDropdownChanged = (value, text, $control) => {
    const props = this._props;
    value = this.normalizeValue(value, props.multiple, props.delimiter);

    if (this.valuesAreTheSame(value, props.value, props.delimiter)) {
      return console.warn("onDropdownChanged: skipping change with same value ", value);
    }
    else {
      console.info("onDropdownChanged: changing value to ", value, typeof value);
    }

    this._handleEvent("onChange", props, undefined, {}, value);
  }

  onDropdownAdd = (addedValue, addedText, $control) => {
    const props = this._props;
console.info("onDropdownAdd", addedValue, props.value);
    let values = this.normalizeValue(props.value, true, props.delimiter) || [];
    if (values.includes(addedValue)) return console.warn("Attempting to re-add value ", addedValue);
    values = [...values, addedValue];
console.info("changing to ", values);
    this._handleEvent("onChange", props, undefined, {}, values);
  };

  onDropdownRemove = (removedValue, removedText, $control) => {
    const props = this._props;
    let values = this.normalizeValue(props.value, true, props.delimiter) || [];
    const index = values.indexOf(removedValue);
console.warn("onDropdownRemove", removedValue, values, index);
    if (index === -1) return console.warn("Attempting to remove missing value ", removedValue);
    values.splice(index, 1);
console.info("changing to ", values);
    this._handleEvent("onChange", props, undefined, {}, values);
  }

  renderControl(props) {
    const controlProps = this.getControlProps(props);

    // pass `options` and/or `enum` down as `items` if items wasn't specified
    if (!controlProps.items) controlProps.items = (props.options || props["enum"]);

    // onChange or onAdd/onRemove for multi-select
    if (props.multiple) {
      controlProps.onAdd = this.onDropdownAdd;
      controlProps.onRemove = this.onDropdownRemove;
      controlProps.onChange = Function.prototype;

      // don't animate in labels
      controlProps.label = { duration: 0 };
    }
    else {
      controlProps.onChange = this.onDropdownChanged;
    }
    return React.createElement(SUIDropdown, controlProps);
  }

}


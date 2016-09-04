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
	  delimiter: ","
	}

	// Properties passed to control.
	static controlProps = [
		...Control.controlProps, "allowAdditions", "multiple", "search", "selection"
	];


  // Return true if 2 values are the same.
  // Arrays will be joined
  valuesAreTheSame(value1, value2) {
    if (Array.isArray(value1)) value1 = value1.join(this.props.delimiter);
    if (Array.isArray(value2)) value2 = value2.join(this.props.delimiter);
    return value1 === value2;
  }

  getCurrentValue(props) {
    const value = super.getCurrentValue(props);
    // if multi-select, convert non-arrays to arrays
    if (props.multiple && !Array.isArray(value)) {
      if (typeof value === "string") {
        if (value === "") return [];
        return value.split(props.delimiter);
      }
      return [value];
    }
    return value;
  }

  // Custom event for dropdown change which we pass up to the control.
  @debounce(10)
  onDropdownChanged(value) {
    if (this.valuesAreTheSame(value, this._renderValue)) {
      return console.warn("onDropdownChanged: skipping change with same value ", value);
    }

    if (this._props.multiple) {
      if (typeof value === "string" && value !== "") value = value.split(",");
    }
    this._handleEvent("onChange", this._props, undefined, {}, value);
  }

  renderControl(props) {
    const controlProps = this.getControlProps(props);

    // pass `options` and/or `enum` down as `items` if items wasn't specified
    if (!controlProps.items) controlProps.items = (props.options || props["enum"]);
    controlProps.onChange = (value) => this.onDropdownChanged(value);

    controlProps.label = { duration: 0 };

    // remember the value we were rendered with to avoid endless loop in `onDropdownChanged`
    this._renderValue = props.value;

    return React.createElement(SUIDropdown, controlProps);
  }

}


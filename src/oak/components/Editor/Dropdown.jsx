//////////////////////////////
// Editor.Dropdown class
//
//	Select
//
//////////////////////////////

import React, { PropTypes } from "react";
import ReactDOM from "react-dom";

import { classNames, unknownProps, mergeProps, stringOrFn, boolOrFn } from "oak-roots/util/react";
import { definedProperties } from "oak-roots/util/object";

import SUIDropdown from "themes/SUI/Dropdown";

import Control from "./Control";


// "<Select>" Control subclass.
// Specify `@options` or `@values` (e.g. from schema) as:
//  - comma-separated string of values:     "a,b"
//	- array of scalar values								["a", "b"]
//	- array of arrays `[ key, "label" ]`		[ ["a", "AAA", "b": "BBB" ] ]
//	- map of `{ key => label }`							{ a: "AAA", b: "BBB" }
//
// If select is not `@required`, we'll automatically add an empty option to the select,
//	whose value will be `undefined` when it is selected.
//
// Note: the values you get back will NOT necessarily be strings if your values/options are no strings,
//				e.g.  <Select values={[ true, false ]}
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
	}

	// Properties passed to control.
	static controlProps = [
		...Control.controlProps, "allowAdditions", "multiple", "search", "selection"
	];


  // Custom event for dropdown change which we pass up to the control.
  onDropdownChanged(value) {
    if (this._props.multiple) {
      if (typeof value === "string" && value !== "") value = value.split(",");
    }
    this._handleEvent("onChange", this._props, undefined, {}, value);
  }

  renderControl(props) {
    const controlProps = this.getControlProps(props);

    // pass `options` and/or `enum` down as `items`
    controlProps.items = (props.options || props["enum"]);
    controlProps.onChange = (value) => this.onDropdownChanged(value);

    return React.createElement(SUIDropdown, controlProps);
  }

}


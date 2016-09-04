//////////////////////////////
// Editor.Control class
//
//	Base class for all editor controls which renders a `control` inside a wrapper element,
//	with `title`, `errors`, `hint`, etc.
//
//	The base class can be used to wrap an arbitrary component,
//	use a subclass to auto-create an inner `control`.
//
//////////////////////////////

import React, { PropTypes } from "react";
import ReactDOM from "react-dom";

import { classNames, unknownProps, mergeProps, stringOrFn, boolOrFn } from "oak-roots/util/react";
import { definedProperties } from "oak-roots/util/object";

import Control from "./Control";


// HTML <select> element which takes dynamic `opions` as:
//	- array of scalar values								["a", "b"]
//	- array of arrays `[ key, "label" ]`		[ ["a", "AAA", "b": "BBB" ] ]
//	- map of `{ key => label }`							{ a: "AAA", b: "BBB" }
export class HTMLSelect extends React.Component {
	static propTypes = {
		options: PropTypes.any,
		required: PropTypes.bool,
		multiple: PropTypes.bool,
		placeholder: PropTypes.string
	}

	//
	//	Component lifecycle
	//

	// On mount, add a `getElementValue` method to the element.
	componentDidMount() {
		const element = ReactDOM.findDOMNode(this);
		element.getElementValue = () => this.getElementValue(element);
	}

	// On unmount, remove the `getElementValue()` method.
	componentWillUnmount() {
		const element = ReactDOM.findDOMNode(this);
		if (element) delete element.getElementValue;
	}

	// Map `selectedIndex` or `selected` attribute of control to values from our normalized `_options`.
	getElementValue(selectElement) {
		// Return an array for multi-select.
		if (this.props.multiple) {
			const value = [];
			this._options.forEach( (option, index) => {
				if (selectElement.options[index].selected) value.push(option.value);
			});
			return value;
		}
		// return single value for normal select
		const option = this._options[selectElement.selectedIndex];
		return option && option.value;
	}

	// Given a set of options as:
	//	- an array of scalar values, or
	//	- an array of arrays as `[value, "label"]`, or
	//	- a `{ value: label }` map
	// return a normalized set of option values as: `[ { value, label }, ...]`.
	//
	// If not `required`, we'll add an empty item at the front of the list with `{ value: undefined, label: placeholder }`.
	normalizeOptions({ options, required, placeholder = "" }) {
		let normalized = [];

		if (Array.isArray(options)) {
			normalized = options.map( option => {
				if (Array.isArray(option)) return { value: option[0], label: option[1] };
				return { value: option, label: "" + option };
			});
		}
		else if (typeof options === "object") {
			normalized = [];
			for (var value in options) {
				normalized.push({ value, label: ""+options[value] });
			}
		}

		normalized.forEach( option => {
			if (option.label.startsWith("-")) {
				option.disabled = true;
				option.label = option.label.substr(1);
			}
		});

		// if not required, add a blank item at the beginning of the list
		if (!required) {
			normalized.unshift({ value: undefined, label: placeholder });
		}

		return normalized;
	}

	render() {
		const { options, ...selectProps } = this.props;
		// normalize options and remember to get value back later
		this._options = this.normalizeOptions(this.props);

		const optionElements = this._options.map( option => <option {...option}>{option.label}</option> );
		return React.createElement("select", selectProps, ...optionElements);
	}

}




// "<Select>" Control subclass.
// Specify `@options` or `@values` (e.g. from schema) as:
//	- array of scalar values								["a", "b"]
//	- array of arrays `[ key, "label" ]`		[ ["a", "AAA", "b": "BBB" ] ]
//	- map of `{ key => label }`							{ a: "AAA", b: "BBB" }
//
// If select is not `@required`, we'll automatically add an empty option to the select,
//	whose value will be `undefined` when it is selected.
//
// Note: the values you get back will NOT necessarily be strings if your values/options are no strings,
//				e.g.  <Select values={[ true, false ]}
export class Select extends Control {
	// Add <Select> specific propTypes
	static propTypes = {
		...Control.propTypes,
		"enum": PropTypes.any,								// List of valid `enum` values from JSON schema.
		options: PropTypes.any,								// Specifier for HTML options, overides `enum`.

		multiple: PropTypes.bool,							// multi-select?
		placeholder: stringOrFn,							// placeholder attribute for `undefined` value.
	}

	// Dynamic input properties.
	static expressionProps = [
		...Control.expressionProps, "placeholder"
	];

	// Properties passed to control.
	static controlProps = [
		...Control.controlProps, "placeholder", "multiple"
	];

	// React will complain if you pass a scalar into a multi-select.
	getCurrentValue(props) {
		const value = super.getCurrentValue(props);
		if (props.multiple && !Array.isArray(value)) return [value];
		return value;
	}

  renderControl(props) {
    const controlProps = this.getControlProps(props);
    controlProps.options = (props.options || props["enum"]);
    return React.createElement(HTMLSelect, controlProps);
  }

}


// Export all as a single object
export default Object.assign({}, exports);

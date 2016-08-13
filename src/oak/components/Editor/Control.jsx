//////////////////////////////
// Editor.Control class
//
//	Base class for all editor controls which renders a `control` inside a wrapper element,
//	with `label`, `errors`, `hint`, etc.
//
//	The base class can be used to wrap an arbitrary component,
//	use a subclass to auto-create an inner `control`.
//
//////////////////////////////

import React, { PropTypes } from "react";

import { classNames, unknownProps, mergeProps } from "oak-roots/util/react";
import { definedProperties } from "oak-roots/util/object";

import Label from "./Label";

import "./Control.less";
import "./width.less";

const stringOrFn = PropTypes.oneOfType([
	PropTypes.string,
	PropTypes.func
]);

const boolOrFn = PropTypes.oneOfType([
	PropTypes.bool,
	PropTypes.func
]);

const numberOrString = PropTypes.oneOfType([
	PropTypes.number,
	PropTypes.string
]);

export default class Control extends React.Component {

	static propTypes = {
		children: PropTypes.element,					// only allow a single child element

	// value semantics -- see `get currentValue()`
		defaultValue: PropTypes.any,					// explicit default value, may be overwritten by the below
		value: PropTypes.any,									// explicit value, may be overwritten by the below
		name: PropTypes.string,								// lens into `form.data` for dynamic value from form

	// schema properties
		disabled: boolOrFn,										// boolean or function => if true, disable the control + label
		hidden: boolOrFn,											// boolean or function => if true, hide the control + label
		required: boolOrFn,										// boolean or function => if true, field is required
// 	values: PropTypes.any
//	validators: PropTypes.array,

	// display
    id: PropTypes.string,									// HTML `id` of control
    className: PropTypes.string,					// HTML class of control
    style: PropTypes.object,							// HTML style of control
		inline: PropTypes.bool,								// `true` == { display: inline-block} , `false` = { display: block }
		width: PropTypes.number,							// # of columns of 20-column grid for display (including label)

	// standard form stuff
		tabIndex: numberOrString,							// HTML tabIndex attribute.
		controlProps: PropTypes.object,				// arbitrary properties to apply directly to the control

	// auto-generated label element
		label: stringOrFn,										// String or function for field label
		labelOn: PropTypes.string,						// Where does the label appear?
		labelProps: PropTypes.object,					// properties to apply to the label element (eg: class, style, etc)

	// auto-generated hint element
		hint: stringOrFn,											// string or function for field hint (below field)
		hintProps: PropTypes.object,					// properties to apply to the hint element (eg: class, style, etc)

	// errors
		error: PropTypes.any,									// string or array of current error messages
		errorProps: PropTypes.object,					// properties to apply to the error element (eg: class, style, etc)

		// events
		onChange: PropTypes.func,							// code to run on field change
		onFocus: PropTypes.func,							// code to run when field is focused
		onBlur: PropTypes.func,								// code to run when field is blurred
		onKeyPress: PropTypes.func,						// code to run on (each?) keypress

		// wrapper styling
		wrapperProps: PropTypes.object,				// Props passed directly to the wrapper
		"data-oid": PropTypes.string,					// necessary so we don't pass oid down to children...
	}

	// Make this control aware of our `form`, which sets our data context.
	static contextTypes = {
		form: PropTypes.any
	}

//
//	Class-level appearance/behavior defaults.
//	Change in subclasses as you like (eg: checkboxes).
//

	// Keys of props which can optionally be specified as function expressions.
	// Any functions will be evaluated in `normalizeProps()` as:
	//		control[key](currentValue, form)
	// Note `value` is always processed and is handled separately from this list -- see `get currrentValue()`
	static expressionProps = [
		"disabled", "label", "hidden", "hint", "required"
	];

	// Keys of (normalized) props we'll pass directly to the control.
	// These are in addition to any explicit `controlProps` or anything not in our `propTypes`.
	// Props whose values are `undefined` will be skipped.
	static controlProps = [
		"className", "defaultValue", "disabled", "hidden", "id", "name", "required", "style", "tabIndex", "value"
	];

	// Keys of (normalized) props we'll pass pass down to our <label> element.
	// Props whose values are `undefined` will be skipped.
	static labelProps = [
		"disabled", "hidden", "inline", "label", "labelOn", "required"
	];

	// Names of event handlers we'll take over and assign directly to the control.
	// NOTE: you MUST have a function defined for each of these, see `onChange` below.
	static controlEvents = [
		"onChange", "onFocus", "onBlur", "onKeyPress"
	]

	// Create JUST the main control element (<input> etc) for this Control.
	// This will be merged with properties from `getControlProps()`.
	// NOTE: the base class doesn't create a default control and assumes you're nesting an explicit control.
	// Use an <Editor-Input> or <Editor-Output> etc variant if you want a control to be created for you.
	createControlElement(props) {}

	// Given an `element` (which is presumably the control created by `createControlElement()`,
	//	return the current `value` for the control, normalized the way you want it saved.
	// Some controls (e.g. checkboxes, selects, etc) will override this.
	getControlValue(controlElement) {
		return controlElement.value;
	}

//
//	Editor.Form integration.
//

	// Syntactic sugar to get our `form` element.
	// Returns `undefined` if form is not set!
	get form() {
		return this.context && this.context.form;
	}

	// Return the current value of the field according to our `form` and/or `value`.
	get currentValue() {
		// if we have a `form`, defer to that.
		if (this.form) return this.form.getValueForControl(this);

		// If we got an explicit value function, evaluate it.
		const { value, defaultValue } = this.props;
		if (typeof value === "function") return value.call(this, defaultValue);

		return value;
	}

	// Return the current error of the field according to our `form` and/or `error`.
	get currentError() {
		if (this.form) return this.form.getErrorForControl(this);
		return this.props.error;
	}

//
//	Event handling.
//
//	The following event handlers will be bound during `render()`
//	with the nested child's handler (if any) as the first argument.
//

	onChange(controlHandler, event) {
		return this._handleEvent("onChange", controlHandler, event);
	}

	onFocus(controlHandler, event) {
		return this._handleEvent("onFocus", controlHandler, event);
	}

	onBlur(controlHandler, event) {
		return this._handleEvent("onBlur", controlHandler, event);
	}

	onKeyPress(controlHandler, event) {
		return this._handleEvent("onKeyPress", controlHandler, event);
	}

	// Generic event handling:
	//	- do any element-provided `controlHandler` first
	//	- then pass to `form[eventName]`
	//	- then pass to `props[eventName]`
	// Bail if any return `false` or set `event.preventDefault`.
	_handleEvent(eventName, controlHandler, event, args) {
		// handle child handler first, bailing if so instructed
		if (typeof controlHandler === "function") {
			const result = controlHandler(event);
			if (result === false || event.defaultPrevented) return false;
		}

		// pass event to form, bailing if so instructed
		const value = this.getControlValue(event.target);
		if (this.form) {
			const result = this.form[eventName](event, this, value);
			if (result === false || event.defaultPrevented) return false;
		}

		// call prop event
		const handler = this.props[eventName];
		if (handler) {
			const result = handler(event, this, value);
			if (result === false || event.defaultPrevented) return false;
		}

		return true;
	}


//
//	Rendering
//

	// Normalize dynamic props before rendering.
	// Returns a clone of the props passed in, with all functions expanded to actual values, etc.
	normalizeProps() {
		// Merge props from the form with explicit props set on this control.
		const props = mergeProps(
			// generic form props for all controls
			this.form && this.form.props.controlProps,

			// schema-level props from the form
			this.form && this.form.getPropsForControl(this),

			// our explicit props
			this.props,

			// ALWAYS override `value` and `error` with values from our form
			{
				value: this.currentValue,
				error: this.currentError
			}
		);

		// Evaluate dynamic properties defined as functions.
		this.constructor.expressionProps.forEach( key => {
			if (typeof props[key] === "function") props[key] = props[key].call(this, props.value, form);
		});

		// Create a control child if one was not passed in
		if (!props.children) props.children = this.createControlElement(props);

		// Remember props for reflection and event handling
		this._props = props;

		return props;
	}


	// Return properties to monkey-patch into the managed control.
	getControlProps(control, props) {
		// Get the union of:
		const controlProps = mergeProps(
			// controlProps we're told by our class to pick up
			definedProperties(props, ...this.constructor.controlProps),

			// any unknown props (not defined in our PropTypes)
			unknownProps(props, this.constructor),

			// any props set directly on the inner control element
			control.props,

			// explicit controlProps set at the control level (safety hatch)
			props.controlProps,
		);

		// Add bound event handlers we take over, pulling in controls's existing event if defined.
		this.constructor.controlEvents.forEach( key => {
			controlProps[key] = this[key].bind(this, control.props[key])
		});

		return controlProps;
	}

	// Render just the control itself (without the label, etc).
	// Passed the normalized `props` from `normalizeProps()`.
// TODO: allow for nested label, etc?  How do we tell what the actual `control` is?
	renderControl(props) {
		// There can be only one.
		if (React.Children.count(props.children) !== 1) {
			console.error("Children must be exactly one element!", props.children);
			return undefined;
		}

		// return a clone of the control with injected properties
		const originalControl = React.Children.only(props.children);
		const controlProps = this.getControlProps(originalControl, props);

		return React.cloneElement(originalControl, controlProps);
	}


	// Render label.  Returns `undefined` if no label to display.
	// Set `props.labelProps` to apply arbitrary properties to the label.
	// Passed the normalized `props` from `normalizeProps()`.
	renderLabel(props) {
		if (!props.label) return undefined;

		const labelProps = mergeProps(
			props.labelProps,
			definedProperties(props, ...this.constructor.labelProps),
		);

		// if labelOn is "wrapped", pass in the control to be wrapped
		if (labelProps.labelOn === "wrapped") labelProps.children = props.control;
		return React.createElement(Label, labelProps);
	}

	// Return props to pass to our <label> element.
	getHintProps(props) {
		return mergeProps(
			{ className: "oak hint" },
			props.hintProps
		);
	}

	// Render hint.  Returns `undefined` if no hint to display.
	// Passed the normalized `props` from `normalizeProps()`.
	renderHint(props) {
		if (!props.hint) return undefined;
// TODO:  <Editor-Hint> ???
		return (
			<label {...this.getHintProps(props)}>
				{props.hint}
			</label>
		);
	}


	// Return props to pass to our <label> element.
	getErrorProps(props) {
		return mergeProps(
			{ className: "oak error" },
			props.errorProps
		);
	}

	// Render error.  Returns `undefined` if no error to display.
	// Passed the normalized `props` from `normalizeProps()`.
	renderError(props) {
		if (!props.error) return undefined;
// TODO:  <Editor-Error> ???
		return (
			<div {...this.getErrorProps(props)}>
				{error}
			</div>
		);
	}


	// Return class names for the OUTER wrapper element.
	// Passed the normalized `props` from `normalizeProps()`.
	getWrapperClassname(props) {
		// Get name of this control's class, avoiding "Control Control"
		const constructorName = this.constructor.name === "Control"
													? "Control"
													: `${this.constructor.name} Control`;
		return classNames(
				"oak",
				{
					disabled: props.disabled,
					required: props.required,
					inline: props.inline
				},
				constructorName,
				props.label && "with-label",
				props.label && props.labelOn && `label-on-${props.labelOn}`,
				props.error && "with-error",
				props.hint && "with-hint",
				props.width && `width-${props.width}`
			);
	}

	// Return normalized props to pass to the wrapper.
	// Passed the normalized `props` from `normalizeProps()`.
	getWrapperProps(props) {
		// Remember in `props.wrapperProps` for debugging.
		props.wrapperProps = {
			...props.wrapperProps,
			className: this.getWrapperClassname(props),
			"data-oid": props["data-oid"]
		}

		return props.wrapperProps;
	}

	// Generic render routine, including rendering label, errors, etc.
	// You generally shouldn't override this -- override one of the `render*()` routines instead.
	render() {
		// Normalized props before rendering.
		const props = this.normalizeProps();

		// forget it if we're hidden
		if (props.hidden) return null;

		// NOTE: control MUST be first (since label may wrap the control if labelOn === "wrapped")
		props.control = this.renderControl(props);
		props.label = this.renderLabel(props);
		props.error = this.renderError(props);
		props.hint = this.renderHint(props);


		const wrapperProps = this.getWrapperProps(props);

		// Assemble children in the correct order according to `labelOn`:
		// - label surrounding the control (eg for Checkboxes)
		if (props.labelOn === "wrapped") {
			// note: in this case, the label will already wrap the control
			return <div {...wrapperProps}>{props.error}{props.label}{props.hint}</div>;
		}
		// - label on right
		else if (props.labelOn === "right") {
			return <div {...wrapperProps}>{props.error}{props.control}{props.label}{props.hint}</div>
		}
		// - label on left by default
		return <div {...wrapperProps}>{props.error}{props.label}{props.control}{props.hint}</div>
	}

}

/////////////////
//
//	Simple control variants
//	TODO: move to a separate file.
//
/////////////////

// Export the base class as "Output"
export class Output extends Control {
	// Create JUST the main control element (<input> etc) for this Control.
	// This will be merged with properties from `getControlProps()`.
	createControlElement(props) {
		return React.createElement("output");
	}

	// Make empty/null/undefined value render as a space for consistent vertical sizing.
	getControlProps(control, props) {
		const controlProps = super.getControlProps(control, props);
		const { value } = controlProps;

		if (value === null || value === undefined || (value.trim && !value.trim())) {
			controlProps.value = " ";		// <-- UTF-8 non-breaking space character
		}
		return controlProps;
	}
}


// Generic "<Input>" class
export class Input extends Control {
	// Add <input> specific propTypes
	static propTypes = {
		...Control.propTypes,

		type: PropTypes.string,								// input type
		placeholder: stringOrFn,							// placeholder attribute shown inside field.
	}

	// Dynamic input properties.
	static expressionProps = [
		...Control.controlProps, "placeholder"
	];

	// Pass input-specific properties to the control.
	static controlProps = [
		...Control.controlProps, "placeholder", "type"
	];

	// Create JUST the main control element (<input> etc) for this Control.
	// This will be merged with properties from `getControlProps()`.
	createControlElement(props) {
		return React.createElement("input");
	}
}


// Text string field.
export class Text extends Input {
	static defaultProps = {
		type: "text"
	}
}

// Password field.
export class Password extends Input {
	static defaultProps = {
		type: "password"
	}
}



// Checkbox field.
export class Checkbox extends Input {
	static propTypes = {
		...Input.propTypes,
		trueValue: PropTypes.any,
		falseValue: PropTypes.any,
	}

	static defaultProps = {
		type: "checkbox",
		labelOn: "wrapped",
		labelProps: {
			style: {
				width: "auto"
			}
		}
	}

	get trueValue() {
		if (this._props.hasOwnProperty("trueValue")) return this._props.trueValue;
		return true;
	}

	get falseValue() {
		if (this._props.hasOwnProperty("falseValue")) return this._props.falseValue;
		return false;
	}

	// Map `checked` attribute of control to an output value.
	getControlValue(controlElement) {
		const checked = controlElement.checked;
		if (checked) return this.trueValue;
		return this.falseValue;
	}

	// map `value` to `checked` in controlProps.
	getControlProps(control, props) {
		const controlProps = super.getControlProps(control, props);
		controlProps.checked = (controlProps.value === this.trueValue);
		return controlProps;
	}
}


// "<Select>" class.
// Specify `@options` or `@values` (from schema) as:
//	- array of scalar values								["a", "b"]
//	- array of arrays `[ key, "label" ]`		[ ["a", "AAA", "b": "BBB" ] ]
//	- map of `{ key => label }`							{ a: "AAA", b: "BBB" }
//
// If select is not `@required`, we'll automatically add an empty option with to the beginning.
export class Select extends Control {
	// Add <input> specific propTypes
	static propTypes = {
		...Control.propTypes,
		values: PropTypes.any,								// List of valid `values` from schema.
		options: PropTypes.any								// Specifier for HTML options, overides `options`.
	}

	// Given an array of options as:
	//	- an array of scalar values, and/or
	//	- an array of arrays as `[key, "label"]`
	// return a set of HTML `<option>` elements.
	static renderOptionsArray(options) {
		return options.map( option => {
			// nested array = `[ key, "value" ]`
			if (Array.isArray(option)) {
				return <option value={option[0]}>{option[1]}</option>;
			}
			// otherwise assume key/value are the same
			return <option value={option}>{option}</option>
		});
	}

	// Given a set of options as a `{ key => value }` map,
	//	return a set of HTML <option> elements.
	static renderOptionsMap(options) {
		return Object.keys(options).map( key => <option value={key}>{options[key]}</option> );
	}

	// Render the options specified for this control, which come from it's "values".
	static renderOptions(options, required) {
		let elements = [];
		if (Array.isArray(options)) {
			elements = this.renderOptionsArray(options);
		}
		else if (typeof options === "object") {
			elements = this.renderOptionsMap(options);
		}

		// if not required, add a blank item at the beginning of the list
		if (!required) {
			elements.unshift(<option value={undefined}></option>);
		}

		return elements;
	}

	// Create JUST the main control element (<input> etc) for this Control.
	// This will be merged with properties from `getControlProps()`.
	createControlElement(props) {
		// Render according to our `renderOptions` method
		const options = this.constructor.renderOptions(props.options || props.values, props.required);
		return React.createElement("select", undefined, ...options);
	}
}

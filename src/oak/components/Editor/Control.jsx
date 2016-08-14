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

import Editor_Error from "./Error";
import Editor_Label from "./Label";

import "./Control.less";

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
		children: PropTypes.any,							// Children

	// value semantics -- see `getCurrentValue()`
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
		width: numberOrString,								// # of columns of 20-column grid for display (including label)

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
		form: PropTypes.any,
		namePrefix: PropTypes.any
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

	// Keys of (normalized) props we'll pass pass down to our <Editor_Label> element.
	// Props whose values are `undefined` will be skipped.
	static labelProps = [
		"disabled", "hidden", "inline", "label", "labelOn", "required"
	];

	// Keys of (normalized) props we'll pass pass down to our <Editor_Error> element.
	// Props whose values are `undefined` will be skipped.
	static errorProps = [
		"disabled", "hidden", "error", "required"
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
		return this.context.form;
	}

	// Return the current value of the field according to our `form` and/or `value`.
	getCurrentValue(props) {
		let value = undefined;

		// look up in our `form` if defined
		if (props.name && this.form) value = this.form.getValueForControl(props.name);

		// If `props.value` is a function, evaluate it passing in the current value.
		// This allows us to transform the value.
		if (typeof props.value === "function") value = props.value.call(this, value);
		else if (value === undefined) value = props.value;

		if (value === undefined) return props.defaultValue;

		return value;
	}

	// Return the current error of the field according to our `form` and/or `error`.
	getCurrentError(props) {
		let error = undefined;
		if (props.name && this.form) error = this.form.getErrorForControl(props.name);
		if (error === undefined) error = props.error;
		return error;
	}

//
//	Event handling.
//
//	The following event handlers will be bound during `render()`
//	with the nested child's handler (if any) as the first argument.
//

	onChange(props, controlHandler, event) {
		return this._handleEvent("onChange", props, controlHandler, event);
	}

	onFocus(props, controlHandler, event) {
		return this._handleEvent("onFocus", props, controlHandler, event);
	}

	onBlur(props, controlHandler, event) {
		return this._handleEvent("onBlur", props, controlHandler, event);
	}

	onKeyPress(props, controlHandler, event) {
		return this._handleEvent("onKeyPress", props, controlHandler, event);
	}

	// Generic event handling:
	//	- do any element-provided `controlHandler` first
	//	- then pass to `form[eventName]`
	//	- then pass to `props[eventName]`
	// Bail if any return `false` or set `event.preventDefault`.
	_handleEvent(eventName, props, controlHandler, event, args) {
		// handle child handler first, bailing if so instructed
		if (typeof controlHandler === "function") {
			const result = controlHandler(event);
			if (result === false || event.defaultPrevented) return false;
		}

		// pass event to form, bailing if so instructed
		const value = this.getControlValue(event.target);
		if (this.form) {
			const result = this.form[eventName](event, this, props.name, value);
			if (result === false || event.defaultPrevented) return false;
		}

		// call prop event
		const handler = props[eventName];
		if (handler) {
			const result = handler(event, props, value);
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
		// Figure out the full "name" of this control, including our `namePrefix`.
		let controlName = this.props.name;
		// if we have a `namePrefix`, add its `name` to ours
		if (controlName && this.context.namePrefix) {
			controlName = `${this.context.namePrefix}.${controlName}`;
		}

		// Merge props from the form with explicit props set on this control.
		const props = mergeProps(
			// form-level props from this control, including schema props
			this.form && this.form.getPropsForControl(controlName),

			// our explicit props
			this.props,
		);

		// ALWAYS override `name`, `value` and `error` with values from our form
		props.name = controlName;
		props.value = this.getCurrentValue(props);
		props.error = this.getCurrentError(props);

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
	getControlProps(controlElement, props) {
		// Get the union of:
		const controlProps = mergeProps(
			// controlProps we're told by our class to pick up
			definedProperties(props, ...this.constructor.controlProps),

			// any unknown props (not defined in our PropTypes)
			unknownProps(props, this.constructor),

			// any props set directly on the inner control element
			controlElement.props,

			// explicit controlProps set at the control level (safety hatch)
			props.controlProps,
		);

		// Add bound event handlers we take over, pulling in controls's existing event if defined.
		this.constructor.controlEvents.forEach( key => {
			controlProps[key] = this[key].bind(this, props, controlElement.props[key])
		});

		return controlProps;
	}

	// Render just the control itself (without the label, etc).
	// Passed the normalized `props` from `normalizeProps()`.
// TODO: allow for nested label, etc?  How do we tell what the actual `control` is?
	renderControl(props) {
		// There can be only one.
		if (React.Children.count(props.children) !== 1) {
			console.error("Control must have exactly one child!!", props.children);
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
	renderLabel(props, children) {
		if (!props.label) return undefined;

		const labelProps = mergeProps(
			props.labelProps,
			definedProperties(props, ...this.constructor.labelProps),
		);
		if (children) labelProps.children = children;

		return React.createElement(Editor_Label, labelProps);
	}

	// Render error.  Returns `undefined` if no error to display.
	// Set `props.errorProps` to apply arbitrary properties to the error.
	// Passed the normalized `props` from `normalizeProps()`.
	renderError(props) {
		if (!props.error) return undefined;

		const errorProps = mergeProps(
			props.errorProps,
			definedProperties(props, ...this.constructor.errorProps),
		);

		return React.createElement(Editor_Error, errorProps);
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

		// Render control element.
		// NOTE: control MUST be rendered first.
		let control = this.renderControl(props);

		// Forget it if we didn't get a control to draw.
		if (!control) return null;

		// Render hint and error elements.
		const hint = this.renderHint(props);
		const error = this.renderError(props);

		// Add a wrapper around the control if we got a hint and/or error.
		// This makes the hint/error line up with the control, not its label.
		if (hint || error) {
			control = <span className='controlWrapper'>{error}{control}{hint}</span>;
		}

		// Render label.
		const label = this.renderLabel(props);

		// Render the wrapper and embedded contents
		const wrapperProps = this.getWrapperProps(props);

		// Assemble children in the correct order according to `labelOn`
		if (props.labelOn === "right") {
			return <div {...wrapperProps}>{control}{label}</div>
		}
		// - label on left by default
		return <div {...wrapperProps}>{label}{control}</div>
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
		labelOn: "right",
		labelProps: {
			style: {
				width: "auto"
			}
		}
	}

//
//	value semantics
//
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

//
//	rendering
//

	// Wrap the control inside a `<label>` so clicking the label will toggle the checkbox.
	renderControl(props) {
		let $control = super.renderControl(props);
		if ($control && props.label) return super.renderLabel(props, $control);
		return $control;
	}

	// Label rendering happens inside `renderControl()`...
	renderLabel(props) {
		return undefined;
	}

}


// "<Select>" class.
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
	// Add <input> specific propTypes
	static propTypes = {
		...Control.propTypes,
		values: PropTypes.any,								// List of valid `values` from schema.
		options: PropTypes.any								// Specifier for HTML options, overides `values`.
	}

	// Given a set of options as:
	//	- an array of scalar values, or
	//	- an array of arrays as `[key, "label"]`, or
	//	- a `{ key: label }` map
	// return a normalized set of option values as: `[ { key, label }, ...]`.
	//
	// If not `required`, we'll add an empty item at the front of the list.
	static normalizeOptions(options, required) {
		let normalized;

		if (Array.isArray(options)) {
			normalized = options.map( option => {
				if (Array.isArray(option)) return { key: option[0], label: option[1] };
				return { key: option, label: "" + option };
			});
		}
		else if (typeof options === "object") {
			normalized = [];
			for (var key in options) {
				normalized.push({ key, label: ""+options[key] });
			}
		}

		// if not required, add a blank item at the beginning of the list
		if (!required) {
			normalized.unshift({ key: undefined, label: "" });
		}

		return normalized;
	}

	// Render a set of normalized options.
	static renderOptions(options) {
		return options.map( option => <option value={option.key}>{option.label}</option> );
	}

	// Create JUST the main control element (<input> etc) for this Control.
	// This will be merged with properties from `getControlProps()`.
	createControlElement(props) {
		// Remember normalized options for `getControlValue`
		this._options = this.constructor.normalizeOptions(props.options || props.values, props.required);
		const options = this.constructor.renderOptions(this._options);
		return React.createElement("select", undefined, ...options);
	}

	// Map `selectedIndex` attribute of control to values from our normalized `_options`.
	getControlValue(controlElement) {
		return this._options[controlElement.selectedIndex].key;
	}

}

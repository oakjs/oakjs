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

import Editor_Error from "./Error";
import Editor_Label from "./Label";

import "./Control.less";

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
//	validators: PropTypes.array,

	// display
    id: PropTypes.string,									// HTML `id` of control
    className: PropTypes.string,					// HTML class of control
    style: PropTypes.object,							// HTML style of control
		inline: PropTypes.bool,								// `true` == { display: inline-block} , `false` = { display: block }
		width: PropTypes.number,							// # of columns of 20-column grid for display (including label)

	// standard form stuff
		tabIndex: PropTypes.number,						// HTML tabIndex attribute.
		controlProps: PropTypes.object,				// arbitrary properties to apply directly to the control

	// auto-generated label element
		title: stringOrFn,										// String or function for field label
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
	// Note `value` and `error` are always processed and is handled separately from this list
	//	-- see `getCurrentValue()` and `getCurrentError()`
	static expressionProps = [
		"disabled", "title", "hidden", "hint", "required"
	];

	// Keys of (normalized) props we'll pass directly to the control wrapper element.
	// These are in addition to any explicit `controlProps` or anything not in our `propTypes`.
	// Props whose values are `undefined` will be skipped.
	static controlProps = [
		"className", "defaultValue", "disabled", "hidden", "id", "name", "required", "style", "tabIndex", "value"
	];

	// Keys of (normalized) props we'll pass pass down to our <Editor_Label> element.
	// Props whose values are `undefined` will be skipped.
	static labelProps = [
		"disabled", "hidden", "inline", "labelOn", "required", "title"
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

	// Given an `element` (which is presumably the control created by `renderControl()`),
	//	return the current `value` for the control, normalized the way you want it saved.
	// Some controls (e.g. checkboxes, selects, etc) will override this.
	getElementValue(controlElement) {
		// TODOC
		// Handle controls which have been given an explicit `getElementValue` method
		//	(e.g. `<HTMLSelect>`, `<HTMLCheckbox>` etc).
		if (typeof controlElement.getElementValue === "function") {
			return controlElement.getElementValue();
		}
		// Assume `controlElement.value` is correct (not universally applicable)
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
	// Passed the normalized `props` from `normalizeProps()`.
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
	// Passed the normalized `props` from `normalizeProps()`.
	getCurrentError(props) {
		let error = undefined;
		if (props.name && this.form) error = this.form.getErrorForControl(props.name);
		if (typeof props.error === "function") error = props.error.call(this, props.value);
		else if (error === undefined) error = props.error;
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
		const value = this.getElementValue(event.target);
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

	get controlName() {
		// Figure out the full "name" of this control, including our `namePrefix`.
		let controlName = this.props.name;
		// if we have a `namePrefix`, add its `name` to ours
		if (controlName && this.context.namePrefix) {
			controlName = `${this.context.namePrefix}.${controlName}`;
		}
		return controlName;
	}

	// Normalize dynamic props before rendering.
	// Returns a clone of the props passed in, with all functions expanded to actual values, etc.
	normalizeProps() {
		// Figure out the full "name" of this control, including our `namePrefix`.
		let controlName = this.controlName;

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

		// Make sure we actually display an empty string label.  (???)
		if (props.title === "") props.title = " ";		// <-- `&nbsp;` in utf-8

		// Remember props for reflection and event handling
		this._props = props;

		return props;
	}


	// Return properties to monkey-patch into the managed control.
	// Passed the normalized `props` from `normalizeProps()`.
	getControlProps(props, controlElement) {
		// Get the union of:
		const controlProps = mergeProps(
			// controlProps we're told by our class to pick up
			definedProperties(props, ...this.constructor.controlProps),

			// any unknown props (not defined in our PropTypes)
			unknownProps(props, this.constructor),

			// any props set directly on the inner control element
			controlElement && controlElement.props,

			// explicit controlProps set at the control level (safety hatch)
			props.controlProps,
		);

		// Add bound event handlers we take over, pulling in controls's existing event if defined
		// for `controlEvents` such as `onChange`.
		this.constructor.controlEvents.forEach( key => {
			controlProps[key] = this[key].bind(this, props, controlElement && controlElement.props[key])
		});

		return controlProps;
	}

	// Render just the control itself (without the label, etc).
	// Passed the normalized `props` from `normalizeProps()`.
	// NOTE:	The base class assumes you're wrapping a SINGLE component.
	//			 	We'll clone the component and add `controlProps` to it.
	// 			 	Subclasses will NOT allow for wrapping, and will create the component directly
	//				(and thus should NOT do a `super()` call).
	renderControl(props) {
		// If we don't have exactly one child, we don't really know how to wrap...
		if (React.Children.count(props.children) !== 1) {
			console.warn(`Generic <Control>s must wrap exactly one child, got children: `, props.children);
			return undefined;
		}

		// return a clone of the control with injected properties
		const originalControl = React.Children.only(props.children);
		const controlProps = this.getControlProps(props, originalControl);
		return React.cloneElement(originalControl, controlProps);
	}

	// Render label.  Returns `undefined` if no label to display.
	// Set `props.labelProps` to apply arbitrary properties to the label.
	// Passed the normalized `props` from `normalizeProps()`.
	renderLabel(props, children) {
		// NOTE: render label as an empty string... ???
		if (props.title === null || props.title === undefined) return undefined;

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

	// Return props to pass to our hint element.
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
			control = <span className='controlWrapper'>{control}{hint}{error}</span>;
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

	// Make empty/null/undefined value render as a space for consistent vertical sizing.
	getControlProps(props) {
		const controlProps = super.getControlProps(props);
		const { value } = controlProps;

		// Output a non-breaking space if necessary
		if (value === null || value === undefined || (value.trim && !value.trim())) {
			controlProps.value = " ";		// <-- UTF-8 non-breaking space character
		}
		return controlProps;
	}

	// Create JUST the <output> element.
	renderControl(props) {
		return React.createElement("output", this.getControlProps(props));
	}
}


// Generic `<Editor-Input>` class
export class Input extends Control {
	// Add <input> specific propTypes
	static propTypes = {
		...Control.propTypes,

		inputType: PropTypes.string,					// <input type> attribute
		placeholder: stringOrFn,							// placeholder attribute shown inside field.
	}

	static defaultProps = {
		inputType: "text"
	}

	// Dynamic input properties.
	static expressionProps = [
		...Control.controlProps, "placeholder"
	];

	// Pass input-specific properties to the control.
	static controlProps = [
		...Control.controlProps, "placeholder"
	];

	getControlProps(props) {
		const controlProps = super.getControlProps(props);

		// map `inputType` => `<input type>`
		controlProps.type = props.inputType;

		// Map input value of undefined/null to empty string,
		//	or React will complain: https://fb.me/react-controlled-components
		const value = controlProps.value;
		if (value === undefined || value === null) controlProps.value = "";

		return controlProps;
	}

	// Create JUST the <input> element.
	renderControl(props) {
		return React.createElement("input", this.getControlProps(props));
	}
}


// `<Editor-Text>` class -- string text field.
export class Text extends Input {}

// `<Editor-Password>` class -- password text field.
export class Password extends Text {
	static defaultProps = {
		inputType: "password"
	}
}



// `<Editor-Checkbox>` class
export class Checkbox extends Input {
	static propTypes = {
		...Input.propTypes,
		checkedValue: PropTypes.any,					//
		uncheckedValue: PropTypes.any,
	}

	static defaultProps = {
		inputType: "checkbox",
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
	get checkedValue() {
		if (this._props.hasOwnProperty("checkedValue")) return this._props.checkedValue;
		return true;
	}

	get uncheckedValue() {
		if (this._props.hasOwnProperty("uncheckedValue")) return this._props.uncheckedValue;
		return false;
	}

	// Map `checked` attribute of control to an output value.
	getElementValue(controlElement) {
		const checked = controlElement.checked;
		if (checked) return this.checkedValue;
		return this.uncheckedValue;
	}

	// map `value` to `checked` in controlProps.
	getControlProps(props) {
		const controlProps = super.getControlProps(props);

		// map `value` to boolean `checked`
		controlProps.checked = (props.value === this.checkedValue);
		delete controlProps.value;

		return controlProps;
	}

	// Wrap the control inside a `<label>` so clicking the label will toggle the checkbox.
	renderControl(props) {
		let control = super.renderControl(props);
		if (control && props.title != null) return super.renderLabel(props, control);
		return control;
	}

	// Label rendering happens inside `renderControl()`...
	renderLabel(props) {
		return undefined;
	}

}


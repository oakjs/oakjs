//////////////////////////////
// Editor.Control class
//
//	Base class for all editor controls which renders a wrapper element, label, errors, etc.
//	as well as the "control" element.
//
//	The base class renders a non-editable "output" element.
//
//////////////////////////////

import React, { PropTypes } from "react";

import { classNames } from "oak-roots/util/react";


export default class Control extends React.Component {

	static propTypes = {
	// wrapper appearance/attributes
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,

	// value semantics
		defaultValue: PropTypes.any,			// explicit default value, may be overwritten by the below
		value: PropTypes.any,							// explicit value, may be overwritten by the below
		field: PropTypes.string,					// lens into `form.data` for dynamic value from form
		getDisplayValue: PropTypes.func,	// function which yields dynamic display value.  see `currentValue()`

	// display
		controlProps: PropTypes.any,			// properties to apply directly to the control
		hidden: PropTypes.any,						// boolean or function => if true, hide the control + label
		disabled: PropTypes.any,					// boolean or function => if true, disable the control + label
		width: PropTypes.number,					// # of columns of 16-column grid for display (including label)

		label: PropTypes.any,							// string or function for field label
		labelOn: PropTypes.string,				// one of "top", "left", "right" <= defaults to form.labelOn
		labelProps: PropTypes.object,			// properties to apply to the label control (eg: class, style, etc)

		hint: PropTypes.any,							// string or function for field hint (below field)

	// form stuff
		tabIndex: PropTypes.number,				// Form tab index

	// TODO: validation / change
		required: PropTypes.any,					// boolean or function => if true, field is required
		error: PropTypes.any,							// string or array of current error messages
		errorOn: PropTypes.string,				// one of "top", "bottom" <= defaults to form.errorOn
		validators: PropTypes.any,				// ????

		// TODO: events
		onChange: PropTypes.func,					// code to run on field change
		onFocus: PropTypes.func,					// code to run when field is focused
		onBlur: PropTypes.func,						// code to run when field is blurred
		onKeyPress: PropTypes.func,				// code to run on (each?) keypress
	}

	// Make this control aware of our `form`, which sets our data context.
	static contextTypes = {
		form: PropTypes.any
	}

//
//	class-level appearance defaults
//	change in subclasses as you like (eg: checkboxes).
//
	// CSS class for the outer wrapper element to distinguish this control
	// OVERRIDE this in your class to specify a unique name if you care!
	static wrapperClass = "output";

	// Where should labels appear if component and form don't specify?
	static labelOn = "left";

	// Where should errors appear if component and form don't specify?
	static errorOn = "bottom";


//
//	Editor.Form integration.
//

	// Syntactic sugar to get our `form` element.
	// Returns `undefined` if form is not set!
	get form() {
		return this.context && this.context.form;
	}

	// Return the current value of the field according to our `form` and our `@name` and/or `@getDisplayValue`.
	get currentValue() {
		const { value, defaultValue, field, getDisplayValue } = this.props;

		// Start with `props.value` or `props.defaultValue`.
		let currentValue = (value === undefined ? defaultValue : value);

		// If we have a `form` and have specified a `field`, use the value of the field in `form.data`.
		// This explicitly overrides the `value`.
		if (this.form && field) {
			currentValue = this.form.get(field);
		}

		// If we have a `getDisplayValue` function, call that to transform the value.
		if (getDisplayValue) {
			currentValue = getDisplayValue.call(this, currentValue);
		}

		return currentValue;
	}


//
//	Rendering
//

	// Normalize dynamic props before rendering.
	// Returns a clone of the props passed in, with all functions expanded to actual values, etc.
	normalizeProps() {
		const formProps = this.form.props || {};

		// clone current props so we can modify them
		const props = {
			...this.props,
			value: this.currentValue
		};

		// normalize dynamic properties if defined as functions
		if (typeof props.hidden === "function") props.hidden = !!props.hidden.call(this, props.value, form);
		if (typeof props.disabled === "function") props.disabled = !!props.disabled.call(this, props.value, form);
		if (typeof props.required === "function") props.required = !!props.required.call(this, props.value, form);
		if (typeof props.label === "function") props.label = props.label.call(this, props.value, form);
		if (typeof props.hint === "function") props.hint = props.hint.call(this, props.value, form);

		// default labelOn / errorOn from form
		if (props.label && props.labelOn === undefined) props.labelOn = formProps.labelOn || this.constructor.labelOn;
		if (props.error && props.errorOn === undefined) props.errorOn = formProps.errorOn || this.constructor.errorOn;

		return props;
	}


	// Render just the control itself (without the label, etc)
	// Set `props.labelProps` to apply arbitrary properties to the label.
	// Passed the normalized `props` from `normalizeProps()`.
	renderControl(props) {
		// Pull out `controlProps.className` if specified.
		const className = classNames([
			"oak output",
			props.controlProps && props.controlProps.className,
			{ disabled: props.disabled }
		]);

		return (
			<output {...props.controlProps} className={className} name={props.field}>
				{props.value}
			</output>
		);
	}

	// Render label.  Returns `undefined` if no label to display.
	// Set `props.labelProps` to apply arbitrary properties to the label.
	// Passed the normalized `props` from `normalizeProps()`.
	renderLabel(props) {
		if (!props.label) return undefined;
		// Pull out `labelProps.className` if specified.
		const className = `oak ${props.labelOn} label ${props.labelProps && props.labelProps.className || ""}`;
		return (
			<label {...props.labelProps} className={className}>
				{props.label}
			</label>
		);
	}

	// Render hint.  Returns `undefined` if no hint to display.
	// Passed the normalized `props` from `normalizeProps()`.
	renderHint(props) {
		if (!props.hint) return undefined;
		// fancy className semantics
		const className = `oak hint`;
		return (
			<label className="oak hint">
				{props.hint}
			</label>
		);
	}

	// Render the errors.  Returns `undefined` if no errors to display.
	// Passed the normalized `props` from `normalizeProps()`.
	renderError(props) {
		if (!props.error) return undefined;
		// fancy className semantics
		const className = `oak ${props.errorOn} error ${props.errorProps && props.errorProps.className || ""}`;
		return (
			<div {...props.errorProps} className={className}>
				{props.error}
			</div>
		);
	}

	// Return class names for the OUTER wrapper element.
	// Passed the normalized `props` from `normalizeProps()`.
	getWrapperClassName(props) {
		return classNames(
				"oak",
				this.constructor.controlClass,
				"control",
				props.className,
				{
					disabled: props.disabled,
					required: props.required,
					hasError: !!props.error,
					hasLabel: !!props.label,
					hasHint: !!props.hint,
				},
				props.label && `labelOn-${props.labelOn}`,
				props.error && `errorOn-${props.errorOn}`,
				props.width && `width-${props.width}`
			);
	}

	// Return all properties to apply to the outer wrapper element.
	// Override this to add any additional props.
	// Passed the normalized `props` from `normalizeProps()`.
	getWrapperProps(props) {
		return {
			id: props.id,
			style: props.style,
			className: this.getWrapperClassName(props),
// TODO: add all unknown props... ???
			"data-oid": props["data-oid"]
		};
	}


	// Generic render routine, including rendering label, errors, etc.
	// You generally shouldn't override this -- override one of the `render*()` routines instead.
	render() {
		// get normalized render props
		const props = this.normalizeProps();

		// forget it if we're hidden
		if (props.hidden) return null;

		// Assemble children in the correct order according to `props`.
		const children = [ this.renderControl(props) ];

		// Add label according to `labelOn`.
		const label = this.renderLabel(props);
		if (label) {
			const position = (props.labelOn !== "right" ? 0 : children.length);
			children.splice(position, 0, label);
		}

		// Add hint.
		const hint = this.renderHint(props);
		if (hint) children.push(hint);

		// Add error according to `errorOn`.
		const error = this.renderError(props)
		if (error) {
			const position = (props.errorOn === "top" ? 0 : children.length);
			children.splice(position, 0, error);
		}

		const wrapperProps = this.getWrapperProps(props);
		return React.createElement("div", wrapperProps, ...children);
	}

}

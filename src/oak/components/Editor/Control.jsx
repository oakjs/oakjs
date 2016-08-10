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

import "./Control.less";

export default class Control extends React.Component {

	static propTypes = {
		children: PropTypes.element,			// only allow a single child element

	// wrapper appearance/attributes
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,

	// value semantics
		defaultValue: PropTypes.any,			// explicit default value, may be overwritten by the below
		value: PropTypes.any,							// explicit value, may be overwritten by the below
		name: PropTypes.string,						// lens into `form.data` for dynamic value from form
		getDisplayValue: PropTypes.func,	// function which yields dynamic display value.  see `currentValue()`

	// display
		controlProps: PropTypes.any,			// properties to apply directly to the control
		hidden: PropTypes.any,						// boolean or function => if true, hide the control + label
		disabled: PropTypes.any,					// boolean or function => if true, disable the control + label
		inline: PropTypes.bool,						// `true` == { display: inline-block} , `false` = { display: block }
		width: PropTypes.number,					// # of columns of 16-column grid for display (including label)

		label: PropTypes.any,							// string or function for field label
		labelOn: PropTypes.string,				// one of "top", "left", "right" <= defaults to form.labelOn
		labelProps: PropTypes.object,			// properties to apply to the label element (eg: class, style, etc)

		hint: PropTypes.any,							// string or function for field hint (below field)
		hintProps: PropTypes.object,			// properties to apply to the hint element (eg: class, style, etc)

	// form stuff
		tabIndex: PropTypes.number,				// Form tab index

	// TODO: validation / change
		required: PropTypes.any,					// boolean or function => if true, field is required
		error: PropTypes.any,							// string or array of current error messages
		errorOn: PropTypes.string,				// one of "top", "bottom" <= defaults to form.errorOn
		errorProps: PropTypes.object,			// properties to apply to the error element (eg: class, style, etc)
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
	static controlClass = "output";

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
		const { value, defaultValue, name, getDisplayValue } = this.props;

		// Start with `props.value` or `props.defaultValue`.
		let currentValue = (value === undefined ? defaultValue : value);

		// If we have a `form` and have specified a `name`, take value from `form.data[<name>]`.
		// This explicitly overrides the `value`.
		if (this.form && name) {
			currentValue = this.form.get(name);
		}

		// If we have a `getDisplayValue` function, call that to transform the value.
		if (getDisplayValue) {
			currentValue = getDisplayValue.call(this, currentValue);
		}

		return currentValue;
	}

//
//	Event handling.
//
//	The following event handlers will be bound during `render()`
//	with the nested child's handler (if any) as the first argument.
//

		getTargetValue(event) {
			return event.target.value;
		}

		onChange(childHandler, event) {
			return this._handleEvent("onChange", childHandler, event);
		}

		onFocus(childHandler, event) {
			return this._handleEvent("onFocus", childHandler, event);
		}

		onBlur(childHandler, event) {
			return this._handleEvent("onBlur", childHandler, event);
		}

		onKeyPress(childHandler, event) {
			return this._handleEvent("onKeyPress", childHandler, event);
		}


		// Generic event handling:
		//	- do any element-provided `childHandler` first
		//	- then pass to the form
		//	- then
		_handleEvent(eventName, childHandler, event, args) {
			// handle child handler first, bailing if so instructed
			if (typeof childHandler === "function") {
				const result = childHandler(event);
				if (result === false || event.defaultPrevented) return false;
			}

			// pass event to form, bailing if so instructed
			const value = this.getTargetValue(event);
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

		// if we weren't passed any children, create a default one
		if (!props.children) props.children = this.getControlElement(props);

		return props;
	}

	getControlElement(props) {
		return React.createElement("output");
	}

	// Render just the control itself (without the label, etc)
	// Set `props.controlProps` to apply arbitrary properties to the label.
	// Passed the normalized `props` from `normalizeProps()`.
	renderControl(props) {
		const { children, controlProps, value, name, disabled, required } = props;

		if (React.Children.count(children) !== 1) {
			console.error("children must be exactly one element!", children);
			return undefined;
		}

		const childProps = {
			...controlProps,
			value,
			// bind events we take over, pulling in child's event if defined
			onChange: this.onChange.bind(this, children.onChange),
			onFocus: this.onFocus.bind(this, children.onFocus),
			onBlur: this.onBlur.bind(this, children.onBlur),
			onKeyPress: this.onKeyPress.bind(this, children.onKeyPress),
		}
		// map certain properties only if actually set
		if (name) childProps.name = name;
		if (disabled) childProps.disabled = true;
		if (required) childProps.required = true;

		// return a clone of the child with injected properties
		return React.cloneElement(children, childProps);
	}

	// Render label.  Returns `undefined` if no label to display.
	// Set `props.labelProps` to apply arbitrary properties to the label.
	// Passed the normalized `props` from `normalizeProps()`.
	renderLabel(props) {
		const { label, labelOn, labelProps } = props;
		if (!label) return undefined;
		// Pull out `labelProps.className` if specified.
		const className = `oak ${labelOn} label ${labelProps && labelProps.className || ""}`;
		return (
			<label {...labelProps} className={className}>
				{label}
			</label>
		);
	}

	// Render hint.  Returns `undefined` if no hint to display.
	// Passed the normalized `props` from `normalizeProps()`.
	renderHint(props) {
		const { hint, hintProps } = props;
		if (!props.hint) return undefined;
		// Pull out `labelProps.className` if specified.
		const className = `oak hint ${hintProps && hintProps.className || ""}`;
		return (
			<label {...hintProps} className={className}>
				{props.hint}
			</label>
		);
	}

	// Render error.  Returns `undefined` if no error to display.
	// Passed the normalized `props` from `normalizeProps()`.
	renderError(props) {
		const { error, errorOn, errorProps } = props;
		if (!error) return undefined;
		// Merge with `errorProps.className` if specified.
		const className = `oak ${errorOn} error ${errorProps && errorProps.className || ""}`;
		return (
			<div {...errorProps} className={className}>
				{error}
			</div>
		);
	}

	// Return class names for the OUTER wrapper element.
	// Passed the normalized `props` from `normalizeProps()`.
	getWrapperClassName(props) {
		return classNames(
				"oak",
				{
					disabled: props.disabled,
					required: props.required,
					inline: props.inline
				},
				this.constructor.controlClass,
				"Control",
				props.className,
				props.error && `with-error errorOn-${props.errorOn}`,
				props.label && `with-label labelOn-${props.labelOn}`,
				props.hint && "with-hint",
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

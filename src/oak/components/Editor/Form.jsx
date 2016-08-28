//////////////////////////////
// Editor.Form class
//
// Form class which optionally works with a `JSON schema` to initialize properties.
//////////////////////////////

import React, { Children, PropTypes } from "react";

import { getPath, getParent, setPath } from "oak-roots/util/path";
import { classNames, mergeProps } from "oak-roots/util/react";

export default class Form extends React.Component {

	static propTypes = {
	// wrapper appearance/attributes
    id: PropTypes.string,             // id for the wrapper element
    className: PropTypes.string,      // css class for the wrapper element
    style: PropTypes.object,          // style for the wrapper element

  // data semantics
    data: PropTypes.any,              // object we're editing
    mode: PropTypes.string,           // "loading", "error", "saving", "saved"
    schema: PropTypes.object,         // JSON schema for this form.

  // saving semantics
    immediate: PropTypes.bool,        // `true` = immediate edit of data, `false` = `save()` cycle.
    save: PropTypes.func,             // function to call to save the form

  // defaults which apply to ALL controls in the form
    controlProps: PropTypes.object,   // Arbitrary props to pass to all controls
  };

  constructor(props) {
    super(props);
    this.state = {
      errors: undefined     // map of { `field.name` => [errors] }
    };
  }


//
//  Context
//

  // Pass this form instance to our children as `context.form`.
  // `Editor.Control`s will automatically look for this.
  static childContextTypes = {
    form: PropTypes.any
  }

  getChildContext() {
    return {
      form: this
    }
  }


//
//  Data manipulation
//
  // Return a POINTER to the form data object.
  // Override in a subclass or instance to do something clever.
  get data() {
    return this.props.data;
  }

  get(path, defaultValue) {
    const value = getPath(path, this.data);
    if (value === undefined) return defaultValue;
    return value;
  }

  set(path, value) {
    setPath(value, path, this.data);
    this.forceUpdate();
  }

  get schema() {
    return this.props.schema;
  }

  // Return (non-normalized) properties for a specific control
  //  according to our `schema` and our `props.controlProps`.
  // NOTE: this is current JSON-schema specific...
  getPropsForControl(controlName) {
    const { controlProps } = this.props;
    const schemaProps = this.schemaPropsForControl(controlName);

    if (schemaProps && controlProps) return mergeProps(controlProps, schemaProps);
    if (schemaProps) return schemaProps;
    return controlProps;
  }

  // Return normalized schema properties for a specific control.
  // NOTE: this is JSON-schema specific at this point...
  // TODO: move this into a subclass or property-inject it somehow
  schemaPropsForControl(controlName) {
    const { schema } = this;
    if (!schema) return undefined;

    const props = getPath(controlName, schema.properties);
// TODO: nested controlName requires different required strategy here...
    const required = !!(schema.required && schema.required.includes(controlName));
    if (props && required) return { ...props, required };
    if (props) return props;
    return { required };
  }

  // Return the value we should
  getValueForControl(controlName) {
    if (controlName) return this.get(controlName);
  }

  // Save a value for a particular control.
  // TODO: custom save???
  saveValueForControl(controlName, currentValue) {
    if (controlName) return this.set(controlName, currentValue);
  }

  // Return the error associated with a particular form control.
  getErrorForControl(controlName) {
    if (controlName && this.state && this.state.errors) return this.state.errors[controlName];
  }

//
//  Event handlers from nested `<Editor.Control>`s
//
  onChange(event, control, controlName, currentValue) {
    this.saveValueForControl(controlName, currentValue);

    if (this.props.onChange) {
      this.props.onChange.call(this, event, control, controlName, currentValue);
    }
  }

  onFocus(event, control, controlName) {
    this._focused = control;

    if (this.props.onFocus) {
      this.props.onFocus.call(this, event, control, controlName);
    }
  }

  onBlur(event, control, controlName) {
    delete this._focused;

    if (this.props.onBlur) {
      this.props.onBlur.call(this, event, control, controlName);
    }
  }

  onKeyPress(event, control, controlName) {
    if (this.props.onKeyPress) {
      this.props.onKeyPress.call(this, event, control, controlName);
    }
  }


//
//  Rendering
//

  // Return css class name for the <form> element.
  getFormClassName(props) {
    return classNames(
      "oak Editor",
      props.className,
      props.mode
    );
  }

  // Return properties to pass to the <form> element.
  getFormProps(props) {
    return {
      id: props.id,
      style: props.style,
      className: this.getFormClassName(props),
// TODO: add all unknown props... ???
			"data-oid": props["data-oid"]
    }
  }

  mungeChildren(props) {
    return Children.toArray(props.children);
  }

  render() {
    const formProps = this.getFormProps(this.props);
    const children = this.mungeChildren(this.props);
    // TODO: nested forms maybe don't render a <form> element?
    return React.createElement("form", formProps, ...children);
  }

}

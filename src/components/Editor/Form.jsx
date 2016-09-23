//////////////////////////////
// Editor.Form class
//
// Form class which optionally works with a `JSON schema` to initialize properties.
//
// TODO:
//  - "cloneData" to store data in state temporarily?
//////////////////////////////

import React, { Children, PropTypes } from "react";
import ReactDOM from "react-dom";

import { getPath, getParent, setPath } from "oak-roots/util/path";
import { classNames, mergeProps } from "oak-roots/util/react";

import OakComponent from "../Oak/OakComponent";

import "./Form.less";

export default class Form extends OakComponent {

  static propTypes = {
  // wrapper appearance/attributes
    id: PropTypes.string,             // id for the wrapper element
    className: PropTypes.string,      // css class for the wrapper element
    style: PropTypes.object,          // style for the wrapper element
    appearance: PropTypes.string,     // random appearance stuff

  // data semantics
    data: PropTypes.any,              // object we're editing
    mode: PropTypes.string,           // "loading", "error", "saving", "saved"
    schema: PropTypes.object,         // JSON schema for this form.

  // saving semantics
    immediate: PropTypes.bool,        // `true` = immediate edit of data, `false` = `save()` cycle.
    save: PropTypes.func,             // function to call to save the form

  // defaults which apply to ALL controls in the form
    controlProps: PropTypes.object,   // Arbitrary props to pass to all controls

  // functionality
    autoFocus: PropTypes.any          // `true` = autofocus first field
                                      // `<string>` = first field with that name
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
//  Component lifecycle
//
  componentDidMount() {
    super.componentDidMount();
    this.autoFocus();
  }

  componentDidUpdate() {
    super.componentDidUpdate();
    this.autoFocus();
  }

  // Auto-focus according do `props.autoFocus`:
  //  - if `true`, select the first available non-disabled field
  //  - if a string, select the first available non-disabled field with that `name`.
  autoFocus() {
    // if something is already focused, forget it
    if (this._focused) return;

    const { autoFocus } = this.props;
    if (!autoFocus) return;

    const selector = (autoFocus === true ? `[name]` : `[name='${autoFocus}']`);
    const field = this.$ref().find(selector).filter(":not([disabled])")[0];
    if (!field) return;

    // attempt to `select()` the field first
    try {
      field.select();
      return;
    } catch (e) {}

    // if that doesn't work, try to `focus()` in it.
    try {
      field.focus();
    } catch (e) {}
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
    return schemaProps || controlProps;
  }

  // Return normalized schema properties for a specific control.
  // NOTE: this is JSON-schema specific at this point...
  // TODO: move this into a subclass or property-inject it somehow?
  schemaPropsForControl(controlName) {
    const { schema } = this;
    if (!schema || !controlName) return undefined;

// TODO: nested controlName requires different props / required strategy here...
    const props = getPath(controlName, schema.properties);
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
    if (controlName) this.set(controlName, currentValue);
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

    this.onFieldChanged(control, controlName, currentValue);

    if (this.props.onChange) {
      this.props.onChange.call(this, event, control, controlName, currentValue);
    }
  }

  // Called when a field changes, AFTER the value for the control has been updated.
  // Use this to perform any special saving logic...
  onFieldChanged(control, controlName, currentValue) {}

  onFocus(event, control, controlName) {
    const $root = $(ReactDOM.findDOMNode(control));
    $root.addClass("with-focus");

    this._focused = control;

    if (this.props.onFocus) {
      this.props.onFocus.call(this, event, control, controlName);
    }
  }

  onBlur(event, control, controlName) {
    const $root = $(ReactDOM.findDOMNode(control));
    $root.removeClass("with-focus");

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
      "oak Form",
      props.appearance,
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

// Make everything draggable but not droppable
import { editifyMap } from "oak/EditorProps";
editifyMap(exports, { draggable: true, droppable: true });

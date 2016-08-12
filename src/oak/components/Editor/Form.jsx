//////////////////////////////
// Editor.Control class
//
// Base class for all editor controls.
//////////////////////////////

import React, { PropTypes } from "react";

import { getPath, setPath } from "oak-roots/util/path";
import { classNames } from "oak-roots/util/react";

export default class Form extends React.Component {

	static propTypes = {
	// wrapper appearance/attributes
    id: PropTypes.string,             // id for the wrapper element
    className: PropTypes.string,      // css class for the wrapper element
    style: PropTypes.object,          // style for the wrapper element

  // data semantics
    data: PropTypes.any,              // object we're editing
    state: PropTypes.string,          // "loading", "error", "saving", "saved"

  // saving semantics
    immediate: PropTypes.bool,        // `true` = immediate edit of data, `false` = `save()` cycle.
    save: PropTypes.func,             // function to call to save the form

  // defaults which apply to ALL controls in the form
    controlProps: PropTypes.object,   // Arbitrary props to pass to all controls
  };

  static initialState = {
    errors: undefined             // map of { `field.name` => [errors] }
  }


//
//  Context
//

  // Pass this form instance to our children as `context.form`.
  // `Editor.Control`s will automatically look for this.
  static childContextTypes = {
    form: PropTypes.any,
  }

  getChildContext() {
    return { form: this }
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

  // Return (non-normalized) properties for a control.
  getPropsForControl(control) {
    const { schema } = this.props;
    const { name } = control.props;
    if (schema && name) return schema[name];
  }

  // Return the value we should
  getValueForControl(control) {
    const { name, value, defaultValue } = control.props;

    if (name) return this.get(name, defaultValue);
    if (typeof value === "function") return value.call(control, defaultValue);
    return value;
  }

  // Save a value for a particular control.
  // TODO: custom save???
  saveValueForControl(control, currentValue) {
    const { name } = control.props;
    if (name) return this.set(name, currentValue);
  }

  // Return the error associated with a particular form control.
  getErrorForControl(control) {
    const { name, error } = control.props;
    if (name && this.state && this.state.errors) return this.state.errors[name];
    if (error) return error;
  }

//
//  Event handlers from nested `<Editor.Control>`s
//
  onChange(event, control, currentValue) {
    this.saveValueForControl(control, currentValue);

    if (this.props.onChange) {
      this.props.onChange.call(this, event, control, currentValue);
    }
  }

  onFocus(event, control, currentValue) {
    this.setState({ focused: control });

    if (this.props.onFocus) {
      this.props.onFocus.call(this, event, control, currentValue);
    }
  }

  onBlur(event, control, currentValue) {
    this.setState({ focused: undefined });

    if (this.props.onBlur) {
      this.props.onBlur.call(this, event, control);
    }
  }

  onKeyPress(event, control, currentValue) {
    if (this.props.onKeyPress) {
      this.props.onKeyPress.call(this, event, control);
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
      props.state
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

  render() {
    const formProps = this.getFormProps(this.props);
    // TODO: nested forms maybe don't render a <form> element?
    return (
      <form {...formProps}>
        {this.props.children}
      </form>
    );
  }

}

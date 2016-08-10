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

  // field defaults which you can specify at the form-level
		labelOn: PropTypes.string,		    // one of "top", "left", "right"
		errorOn: PropTypes.string,		    // one of "top", "bottom"

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

  get(path) {
    return getPath(path, this.data);
  }

  set(path, value) {
    setPath(value, path, this.data);
    this.forceUpdate();
  }


//
//  Event handlers from nested `<Editor.Control>`s
//
  onChange(event, field, value) {
    if (field.props.field) {
      this.set(field.props.field, value);
    }
  }

  onFocus(event, field, value) {
    this.setState({ focused: field });
  }

  onBlur(event, field, value) {
    this.setState({ focused: undefined });
  }

  onKeyPress(event, field, value) {}


//
//  Rendering
//

  // Return css class name for the <form> element.
  getFormClassName(props) {
    return classNames(
      "oak editor",
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

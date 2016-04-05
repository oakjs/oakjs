//////////////////////////////
//
//  OakComponent
//
//  Normal react component which pulls available data from context
//
//////////////////////////////

import React, { PropTypes } from "react";

import { unknownProps } from "oak-roots/util/react";

import Stub from "./Stub";

export default class OakComponent extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
  }

  // Pull context in so we can get components and other juicy stuffs.
  static contextTypes = {
    oak: React.PropTypes.any,
    project: React.PropTypes.any,
    section: React.PropTypes.any,
    page: React.PropTypes.any,
    components: React.PropTypes.any,
  };

  //////////////////////////////
  // Component Lifecycle
  //////////////////////////////

  componentDidMount() {
    this._isMounted = true;
  }

  componentDidUpdate() {
    this._isMounted = true;
  }

  componentWillUpdate() {
    this._isMounted = false;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }


  //////////////////////////////
  // Set state on a short delay
  //////////////////////////////
  setStateSoon(newState, delay = 0) {
    setTimeout( () => this.setState(newState), delay);
  }


  //////////////////////////////
  // Manipulating rendered elements
  //////////////////////////////

	// Return one our `ref`s DOM node as a jQuery vector.
	// If you don't pass a `ref` string, we'll get the root node.
	// NOTE: this is not very react-y...
	$ref(refName) {
		const ref = (refName ? this.refs[refName] : this);
		if (!ref || !this._isMounted) return $();
		return $(ReactDOM.findDOMNode(ref));
	}

  //////////////////////////////
  // Rendering
  //////////////////////////////

  // Return a component... TODOC
  getThemeComponentForType(type) {
    if (typeof type === "function") return type;

    let component = type;
    if (this.controller) {
      component = this.controller.getThemeComponentForType(type);
    }
    if (!component) {
      console.warn(`${this}.getThemeComponentForType(${type}): cant find component, returning <Stub/>`);
      component = Stub;
    }
    return component;
  }

  // Create an element, using our controller's `components` as necessary.
  createElement(type, props, ...children) {
    const component = this.getThemeComponentForType(type);
    return React.createElement(component, props, ...children);
  }

  // Override to add class name bits to all subclasses.
  getClassName(props) {
    return props.className;
  }

  getRenderProps(props) {
    const { id, style } = props;
    return {
      id,
      className: this.getClassName(props),
      style,
      // add all properties not defined in your `propTypes` to the root element
      ...unknownProps(props, this.constructor)
    }
  }

  render() {
    const props = this.getRenderProps(this.props);
    return <div {...props}>{this.props.children}</div>;
  }

  //////////////////////////////
  // Debug
  //////////////////////////////

  toString() {
    return `<${this.constructor.name}/>`;
  }

}

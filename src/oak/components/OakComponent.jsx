//////////////////////////////
//
//  OakComponent
//
//  Normal react component which pulls available data from context
//
//////////////////////////////

import React, { PropTypes } from "react";

import { classNames, unknownProps } from "oak-roots/util/react";

import Stub from "./Stub";

export default class OakComponent extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,

    // Are we currently hidden?  You can pass a function which will be called with scope `this`.
    hidden: PropTypes.oneOfType([ PropTypes.bool, PropTypes.func ]),
  }

  // Pull context in so we can get components and other juicy stuffs.
  static contextTypes = {
    _controller: React.PropTypes.any,
    oak: React.PropTypes.any,
    project: React.PropTypes.any,
    section: React.PropTypes.any,
    page: React.PropTypes.any,
    components: React.PropTypes.any,
  };

  //////////////////////////////
  // Syntactic sugar
  //////////////////////////////

	// Return whether or not we should be currently `hidden`.
	// NOTE: if we ARE hidden, `render()` will return without actually rendering.
	get hidden() {
    const { hidden } = this.props;
    if (typeof hidden === "function") return hidden.call(this);
    if (hidden !== undefined) return !!hidden;
	}

  //////////////////////////////
  // Component Lifecycle
  //////////////////////////////

	// Maintain an `_isMounted` flag so we can know when it's safe to get refs
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
  // Manipulating rendered elements
  //////////////////////////////

	// Return one of our refs as a DOM node.
  // If you don't pass a `refName` string, we'll get the root node.
	// Returns `undefined` if we're not rendered or we can't find the ref.
  ref(refName) {
    if (!this._isMounted) return undefined;
    const ref = (refName ? this.refs[refName] : this);
    if (!ref) return $();
    return ReactDOM.findDOMNode(ref);

  }

  // Return one our `ref`s DOM node as a jQuery vector.
  // ALWAYS returns a jQuery vector, but it may be empty.
  // DEPRECATED
  $ref(refName) {
  	return $(this.ref(refName));
  }

  //////////////////////////////
  // Rendering
  //////////////////////////////


  // Override to add class name bits to all subclasses.
  // Results of this are processed with `classNames()`,
  //	so you can return an array if you like...
  getClassName(props) {
    return props.className;
  }

	//
  getRenderProps(props) {
    const { id, style } = props;
    return {
      id,
      className: classNames(this.getClassName(props)),
      style,
      // add all properties not defined in your `propTypes` to the root element
      ...unknownProps(props, this.constructor)
    }
  }

	// Default render, which just wraps our children in a named `<div>`.
  render() {
  	if (this.hidden) return null;

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

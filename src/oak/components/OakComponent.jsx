//////////////////////////////
//
//  OakComponent
//
//  Normal react component which pulls available data from context
//
//////////////////////////////

import React, { PropTypes } from "react";

import { debounce } from "oak-roots/util/decorators";
import { classNames, unknownProps } from "oak-roots/util/react";

export default class OakComponent extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,

		children: PropTypes.any,
    // Are we currently hidden?  You can pass a function which will be called with scope `this`.
    hidden: PropTypes.oneOfType([ PropTypes.bool, PropTypes.func ]),
  }

  // Pull context in so we can get `components` and other juicy stuffs.
  static contextTypes = {
    controller: React.PropTypes.any,
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
  // NOTE: if we ARE hidden, `render()` should return without actually rendering.
  get hidden() {
    const { hidden } = this.props;
    if (typeof hidden === "function") return hidden.call(this);
    if (hidden !== undefined) return !!hidden;
  }

  //////////////////////////////
  // Component Lifecycle
  //////////////////////////////

  // When mounting:
  componentDidMount() {
		// Maintain an `_isMounted` flag so we can know when it's safe to get refs
    this._isMounted = true;
    // Set up any global event handlers
    this.installEvents();
    // Update geometry of our elements
    this.updateGeometry();
  }

	// Before we update:
  componentWillUpdate() {
  	// Turn off `_isMounted` flag so we don't to manipulate elements while redrawing
    this._isMounted = false;
  }

	// After updating:
  componentDidUpdate() {
  	// Turn `_isMounted` flag back on
    this._isMounted = true;
    // Update geometry as necessary.
    this.updateGeometry();
  }

	// On unmount:
  componentWillUnmount() {
    // Turn off `_isMounted` flag
    this._isMounted = false;
  	// Clean up any event handlers
    this.removeEvents();
  }


	// Update this component soon, but only if it's still mounted.
	// You can safely use this to redraw when a promise is fulfilled.
	updateSoon = () => {
		if (this._isMounted) this.setState({});
	}


  //////////////////////////////
  // 	Events and Geometry
  //
  //	Implement the methods below to set up events
  //	set up geometry after your object has been drawn.
  //////////////////////////////

	// Initialize events when we're mounted.
	installEvents() {}

	// Remove events when we're unmounted.
	removeEvents() {}

	// Update geometry of our elements after mount / update.
	// You can count on refs, etc being defined here.
	updateGeometry() {}


  //////////////////////////////
  // Manipulating rendered elements
  //////////////////////////////

  // Return one of our refs as a DOM node.
  // If you don't pass a `refName` string, we'll get the root node.
  // Returns `undefined` if we're not rendered or we can't find the ref.
  getElement(ref = this) {
    if (!this._isMounted) return undefined;

    if (ref === this) return ReactDOM.findDOMNode(ref);

		if (typeof ref === "string") {
			const component = this.refs[ref];
			if (component) return ReactDOM.findDOMNode(component);
		}
  }

  // Return one our `ref`s DOM node as a jQuery vector.
  // ALWAYS returns a jQuery vector, but it may be empty.
  // DEPRECATED
  $getElement(refName) {
    return $(this.getElement(refName));
  }

  //////////////////////////////
  // Rendering
  //////////////////////////////


  // Override to add class name bits to all subclasses.
  // Results of this are processed with `classNames()`,
  //  so you can return an array if you like...
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

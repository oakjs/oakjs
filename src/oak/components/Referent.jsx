//////////////////////////////
// <Referent>
//
//  Wrapper class to yield a `ref` to any single Component
//	which you can then use to get a pointer to the DOM element for the wrapped Component.
//
//	Works whether the wrapped Component is stateless or a React.Component subclass.
//
//	e.g.
//		<SomeComponent>
//			<Referent ref="someRef"><SomeStatelessComponent/></Referent>
//		<SomeComponent>
//
//	- In `SomeComponent`, you can use `this.refs.someRef.domElement`
//		to get a pointer to `SomeStatelessComponent`'s DOM element.
//////////////////////////////

import React, { PropTypes } from "react";
import ReactDOM from "react-dom";

import Rect from "oak-roots/Rect";
import elements from "oak-roots/util/elements";

export default class Referent extends React.Component {

	// Return a pointer to the DOM element for our wrapped component child.
	// Will return `undefined` if we're currently in the middle of drawing or have been unmounted.
	// Thus this is safe to call at any time.
	get domElement() {
		if (this._isMounted) return ReactDOM.findDOMNode(this);
	}

	//
	//	React lifecycyle
	//

  // When mounting/unmounting/updating,
	// maintain an `_isMounted` flag so we can know when it's safe to get refs.
  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUpdate() {
    this._isMounted = false;
  }

  componentDidUpdate() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return React.Children.only(this.props.children);
  }
}

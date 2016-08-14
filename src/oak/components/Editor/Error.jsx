//////////////////////////////
// Editor.Error class
//
//	Simple class to render one or more errors inside an `<Editor-Control>`
//  We (currently) assuming that you're passing normalized props from a <Control> to its <Error>.
//
//////////////////////////////

import React, { PropTypes } from "react";

import { classNames, mergeProps } from "oak-roots/util/react";

export default class Error extends React.Component {
	static propTypes = {
  // content
    error: PropTypes.any,                 // error(s) to display

  // schema properties
    hidden: PropTypes.bool,               // Hide the error?
    disabled: PropTypes.bool,             // Show as disabled?
		required: PropTypes.bool,             // Show as required?

  // display
    id: PropTypes.string,									// HTML `id` of error
    className: PropTypes.string,					// HTML class of error
    style: PropTypes.object,							// HTML style of error
  }

  getRenderClass(props) {
    return classNames(
      "oak",
      {
        disabled: props.disabled,
        required: props.required,
      },
      "error"
    );
  }

  getRenderProps(props) {
    return {
      id: props.id,
      style: props.style,
      className: this.getRenderClass(props)
    }
  }

  render() {
    const { hidden, error } = this.props;

    // forget it if we're `hidden` or no error was specified
    if (hidden || !error) return null;

    const errorProps = this.getRenderProps(this.props);

    // render array of errors with bullets
    let errorElements;
    if (Array.isArray(error)) {
      errorElements = error.map( error => <li>{error}</li> );
    }
    else {
      errorElements = [ error ];
    }

    return React.createElement("div", errorProps, ...errorElements);
  }

}

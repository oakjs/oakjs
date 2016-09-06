//////////////////////////////
// Editor.Error class
//
//  Simple class to render one or more errors inside an `<Editor.Control>`
//  We (currently) assuming that you're passing normalized props from a <Control> to its <Error>.
//
//////////////////////////////

import React, { PropTypes } from "react";

import { classNames, unknownProps } from "oak-roots/util/react";

export default class Error extends React.Component {
  static propTypes = {
  // content
    error: PropTypes.any,                 // error(s) to display

  // schema properties
    hidden: PropTypes.bool,               // Hide the error?
    disabled: PropTypes.bool,             // Show as disabled?
    required: PropTypes.bool,             // Show as required?

  // display
    id: PropTypes.string,                  // HTML `id` of error
    className: PropTypes.string,          // HTML class of error
    style: PropTypes.object,              // HTML style of error
  }

  render() {
    const { hidden, error } = this.props;

    // forget it if we're `hidden` or no error was specified
    if (hidden || !error) return null;

    const { id, style, className, disabled, required } = this.props;

    // render array of errors with bullets
    let children;
    if (Array.isArray(error)) {
      children = error.map( error => <li>{error}</li> );
    }
    else {
      children = [ error ];
    }

    const errorProps = {
      id,
      style,
      className: classNames( "oak", { disabled, required }, "error", className),
      ...unknownProps(this.props, this.constructor)
    }

    return React.createElement("div", errorProps, ...children);
  }

}

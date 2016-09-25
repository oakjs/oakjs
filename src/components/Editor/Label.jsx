//////////////////////////////
// Editor.Label class
//
//  Simple label class rendered inside an `<Editor.Control>`
//  We (currently) assuming that you're passing normalized props from a <Control> to its <Editor_Label>.
//
//////////////////////////////

import React, { PropTypes } from "react";

import { classNames, unknownProps } from "oak-roots/util/react";

export default class Label extends React.Component {
  static propTypes = {
  // content
    title: PropTypes.string,              // string label to display
    children: PropTypes.any,              // custom children (will be placed BEFORE the label)

  // schema properties
    hidden: PropTypes.bool,               // Hide the label?
    disabled: PropTypes.bool,             // Show as disabled?
    required: PropTypes.bool,             // Show as required?

  // display
    id: PropTypes.string,                  // HTML `id` of label
    className: PropTypes.string,          // HTML class of label
    style: PropTypes.object,              // HTML style of label

    labelOn: PropTypes.string,
    inline: PropTypes.bool,                // `true` == { display: inline-block} , `false` = { display: block }
    width: PropTypes.number,              // # of columns of 20-column grid for display (including label)
  }

  render() {
    const { hidden, title, children } = this.props;

    // forget it if we're `hidden` or have neither `title` nor `children`.
    if (hidden || ((title === null || title === undefined) && !children)) return null;

    const { id, style, className, labelOn, disabled, required, inline, width } = this.props;
    const labelProps = {
      id,
      style,
      className: classNames("oak", { disabled, required, inline }, labelOn, "label", width && `width-${width}`),
      ...unknownProps(this.props, this.constructor)
    }

    if (labelOn === "right") {
      return <label {...labelProps}>{children}{title}</label>;
    }
    return <label {...labelProps}>{title}{children}</label>;
  }

}

// Make everything draggable but not droppable
import DragProps from "oak-roots/DragProps";
DragProps.register("Editor", { draggable: true, droppable: false }, Label);

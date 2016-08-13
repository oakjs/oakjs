//////////////////////////////
// Editor.Label class
//
//	Simple label class rendered inside an `<Editor-Control>`
//  We (currently) assuming that you're passing normalized props from a <Control> to its <Label>.
//
//////////////////////////////

import React, { PropTypes } from "react";

import { classNames, mergeProps } from "oak-roots/util/react";

export default class Label extends React.Component {
	static propTypes = {
  // content
    label: PropTypes.string,              // string label to display
	  children: PropTypes.any,              // custom children (will be placed BEFORE the label)

  // schema properties
    hidden: PropTypes.bool,               // Hide the label?
    disabled: PropTypes.bool,             // Show as disabled?
		required: PropTypes.bool,             // Show as required?

  // display
    id: PropTypes.string,									// HTML `id` of label
    className: PropTypes.string,					// HTML class of label
    style: PropTypes.object,							// HTML style of label

    labelOn: PropTypes.string,
		inline: PropTypes.bool,								// `true` == { display: inline-block} , `false` = { display: block }
		width: PropTypes.number,							// # of columns of 20-column grid for display (including label)
  }

  getRenderClass(props) {
    return classNames(
      "oak",
      {
        disabled: props.disabled,
        required: props.required,
        inline: props.inline
      },
      props.labelOn,
      "label",
			props.labelOn && `label-on-${props.labelOn}`,
			props.width && `width-${props.width}`
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
    const props = this.props;

    // forget it if we're `hidden` or have neither `label` nor `children`.
    if (props.hidden || (!props.label && !props.children)) return null;

    return (
      <label {...this.getRenderProps(props)}>
        {props.children}{props.label}
      </label>
    );
  }

}

//////////////////////////////
// Simple "Hide-able" class which supports boolean / function "hidden" property.
//
//  Assumes you'll do:
//    render() {
//      const props = this.getRenderProps();
//      ... then use render props to actually draw.
//    }
//////////////////////////////

import { Component, PropTypes } from "react";

export default class Hideable extends Component {
  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    hidden: PropTypes.oneOfType([ PropTypes.bool, PropTypes.func ]),
  }

  getRenderProps() {
    const { hidden, ...props } = this.props;

    // normalize "hidden" in case we were passed a function
    if (hidden !== undefined) {
      if (typeof hidden === "function") props.hidden = hidden.call(this);
      else props.hidden = !!hidden;
    }

    return props;
  }
}


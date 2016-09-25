//////////////////////////////
//
//  <Spacer> component for use with oak.
//
//////////////////////////////

import React, { PropTypes } from "react";
import { classNames } from "oak-roots/util/react";

import "./Spacer.less";

export default function Spacer(props) {
  const {
    className,
    appearance, size, width, height,
    inline, fluid, tiny, small, medium, large, huge, massive
  } = props;

  const spacerProps = {
    className: classNames(className, "oak", size, appearance,
                          { inline, fluid },
                          "spacer"),
    style: {
      width,
      height,
    }
  }

  return <div {...spacerProps}/>;
}

Spacer.propTypes = {
  className: PropTypes.string,
  appearance: PropTypes.string,
  size: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,

  inline: PropTypes.bool,
  fluid: PropTypes.bool,

};

Spacer.defaultProps = {
  size: "medium"
}

// Oak editor prefs
import DragProps from "oak/DragProps";
DragProps.register("Oak", { draggable: true, droppable: false }, Spacer);

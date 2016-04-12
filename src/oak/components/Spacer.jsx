//////////////////////////////
//
//	<Spacer> component for use with oak.
//
//////////////////////////////

import React, { PropTypes } from "react";
import { classNames } from "oak-roots/util/react";

import "./Spacer.css";

export default function Spacer(props) {
  const {
    className,
    appearance, size, width, height,
    inline, tiny, small, medium, large, huge, massive
  } = props;

  const spacerProps = {
    className: classNames(className, "oak", size, appearance,
                          { inline, tiny, small, medium, large, huge, massive },
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
  inline: PropTypes.bool,
  width: PropTypes.number,
  height: PropTypes.number
};

Spacer.defaultProps = {
  size: "medium"
}

// Oak editor prefs
import { editify } from "../EditorProps";
editify({ draggable: true, droppable: false }, Spacer);

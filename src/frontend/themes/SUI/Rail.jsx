//////////////////////////////
//
//	<Rail> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

export default class SUIRail extends React.Component {
  static defaultProps = {
    side: "right"
  };

  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    appearance: PropTypes.string,   // `internal`, `dividing`, `attached`, `close`, `very close`
    side: PropTypes.string,         // `left` or `right`
    internal: PropTypes.bool,
    dividing: PropTypes.bool,
    style: PropTypes.object,
  };

  render() {
    const { id, className, appearance, side, dividing, style, children } = this.props;

    const props = {
      id,
      className: classNames(className, "ui", appearance, side, classMap, "rail"),
      style
    }
    return <div {...props}>{children}</div>;
  }
}

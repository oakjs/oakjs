//////////////////////////////
//
//	<Icon> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

export default class SUIIcon extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,

    appearance: PropTypes.string,
    icon: PropTypes.string,
    circular: PropTypes.bool
  };

  render() {
    const { id, className, style, appearance, circular, icon } = this.props;
    const props = {
      id,
      className: classNames(appearance, { circular }, icon, "icon"),
      style
    }
    return <i {...props}/>
  }

}

// Method to render an icon iff we're passed one, otherwise returns `undefined`.
export function renderIcon(icon) {
  if (!icon) return undefined;
  return <SUIIcon icon={icon}/>;
}

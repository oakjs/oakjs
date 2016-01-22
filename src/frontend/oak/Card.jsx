import React, { PropTypes } from "react";
import classNames from "classnames";

import "./Card.css";

class Card extends React.Component {
  // Ordered list of card constructors.
  // NOTE: your subclass MUST assign this when defining your class.
  static components = [];

  //////////////////////////////
  // Syntactic sugar
  //////////////////////////////

  get components() {
    return this.constructor.components;
  }

  //////////////////////////////
  // Rendering
  //////////////////////////////

  renderChildren() {
    return this.props.children;
  }

  render() {
    const { id, className, style, children } = this.props;
    const props = {
      id,
      className: classNames("oak Card", className),
      style
    }
    return <div {...props}>{this.renderChildren()}</div>;
  }

}
export default Card;

import React, { PropTypes } from "react";
import classNames from "classnames";

import "./Stack.css";

class Stack extends React.Component {
  // Ordered list of card constructors.
  // NOTE: your subclass MUST assign this when defining your class.
  static cardConstructors = [];


  //////////////////////////////
  // Syntactic sugar
  //////////////////////////////

  // Return the cardConstructors defined on our constructor.
  get cardConstructors() {
    return this.constructor.cardConstructors;
  }

  // Return a pointer to a card constructor given an `cardName`.
  // NOTE: this assumes `class.cardConstructors` is set up when stack
  getCardConstructor(cardName = this.state.card) {
    if (!cardName) return undefined;
    return this.cardConstructors.filter(constructor => constructor.name === cardName)[0];
  }

  //////////////////////////////
  // Rendering
  //////////////////////////////

  renderCard() {
    // If we were passed a child element by the router, just return that.
    const { children } = this.props;
    if (children) return children;

    // Otherwise create an instance of the first of our `cardConstructors`.
    const CardConstructor = this.cardConstructors[0];
    if (!CardConstructor) throw new TypeError("stack.renderCard(): no cardConstructors defined.");
    return <CardConstructor/>;
  }

  render() {
    const { id, className, style } = this.props;
    const props = {
      id,
      className: classNames("oak Stack", className),
      style
    }
    return <div {...props}>{this.renderCard()}</div>;
  }

}

export default Stack;

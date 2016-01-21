import React, { PropTypes } from "react";
import classNames from "classnames";

import OakComponent from "./OakComponent";

class Stack extends OakComponent {
  // Stack-specific `propTypes`.
  static propTypes = Object.assign({}, OakComponent.propTypes, {});

  // Stack-specific `defaultProps`.
  static defaultProps = Object.assign({}, OakComponent.defaultProps, {});

  // Stack-specific `stateTypes`.
  static stateTypes = Object.assign({}, OakComponent.stateTypes, {});

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

  // Tack `Stack` on the beginning of our css class name.
  renderClassName() {
    return classNames("Stack", super.renderClassName());
  }

  renderChildren() {
    const { children } = this.props;
    if (children) return children;

    const Card = this.cardConstructors[0];
    if (Card) return <Card/>;

    throw new TypeError("stack.renderChildren(): can't find card to render.");
  }

}

export default Stack;

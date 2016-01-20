import React, { PropTypes } from "react";
import OakComponent from "./OakComponent";

class Stack extends OakComponent {
  // Stack-specific `propTypes`.
  static propTypes = Object.assign({}, OakComponent.propTypes, {});

  // Stack-specific `defaultProps`.
  static defaultProps = Object.assign({}, OakComponent.defaultProps, {});

  // Stack-specific `stateTypes`.
  static stateTypes = Object.assign({}, OakComponent.stateTypes, {
    // `name` of the currently displayed card.
    card: PropTypes.string
  });

  // Ordered list of card constructors.
  // NOTE: your subclass MUST assign this when defining your class.
  static cardConstructors = [];

  constructor() {
    super(...arguments);

    // initialize default card
    // NOTE: this assumes that we have some cardConstructors!
    const defaultCard = this.cardConstructors[0];
    if (!defaultCard) throw TypeError("Stack has no cardConstructors!  Define them in your stack.jsx file.");

    // Initialize with the name of the default card.
    this.state = {
      card: defaultCard.name
    };
  }

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
    const className = super.renderClassName();
    return `Stack ${className}`;
  }

  renderChildren() {
    const Card = this.getCardConstructor();
    return <Card/>;
  }

}

export default Stack;

import React, { PropTypes } from "react";
import { Route, IndexRoute } from "react-router";
import classNames from "classnames";
import Card from "./Card";

// Import custom CSS for all stacks.
import "./Stack.css";

export default class OakStack extends React.Component {
  // Add this stack to a project.
  // ASSUMES: `stack.cardMap` has already been set up (in our `index.js` file).
  // ASSUMES: `stack.components` has already been set up (in our `index.js` file).
  // ASSUMES: That this is being called from `Project.initializeProject()`
  static initializeStack({ project, stack, stackIndex }) {
    stack.project = project;

    // reflection
    stack.id = stack.defaultProps.id;
    stack.title = stack.defaultProps.title;
    stack.path = project.path + "/" + stack.id;

    // Merge project components and stack components.
    // NOTE: MUST happen BEFORE initializing cards.
    stack.components = Object.assign({}, project.components, stack.components);

    // Initialize card indexes.
    const cardMap = stack.cardMap;
    const cardIds = stack.cardIds = Object.keys(cardMap);
    const cards = stack.cards = cardIds.map(cardId => cardMap[cardId]);

    // Initialize cards.
    cards.forEach((card, cardIndex) => Card.initializeCard({ card, stack, cardIndex }));

    // Indexing within the project.
    stack.stackIndex = stackIndex;
    stack.prev = project.stacks[stackIndex-1];
    stack.next = project.stacks[stackIndex+1];

    // Set up stack routing.
    // NOTE: MUST happen AFTER initializing cards.
    const cardRoutes = [
      <IndexRoute component={cards[0]}/>,
      ...cards.map(card => card.route)
    ];
    stack.route = React.createElement(Route, { path: stack.id, component: stack }, ...cardRoutes);


console.group("stack after indexing:");
console.dir(stack);
console.groupEnd();

    return stack;
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

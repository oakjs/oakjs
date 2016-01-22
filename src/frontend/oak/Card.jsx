import React, { PropTypes } from "react";
import { Route } from "react-router";
import classNames from "classnames";

import "./Card.css";

export default class OakCard extends React.Component {

  // Add a `card` to a `stack` at `index`.
  // ASSUMES: `card.components` has already been set up if necessary.
  // ASSUMES: That this is being called from `stack.initializeStack()`
  static initializeCard({ card, stack, cardIndex }) {
    card.stack = stack;
    card.project = stack.project;

    // reflection
    card.id = card.defaultProps.id;
    card.title = card.defaultProps.title;
    card.path = stack.path + "/" + card.id;

    // Set up card components, allowing preset card.components to override stack's components.
    card.components = Object.assign({}, stack.components, card.components);

    // Indexing within the stack.
    card.cardIndex = cardIndex;
    card.prev = stack.cards[cardIndex-1]
    card.next = stack.cards[cardIndex+1];

    // Routing
    card.route = <Route path={card.id} component={card}/>;

console.group("card after indexing:");
console.dir(card);
console.groupEnd();

    return card;
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

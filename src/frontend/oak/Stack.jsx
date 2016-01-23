import React, { PropTypes } from "react";
import { Route, IndexRoute } from "react-router";
import classNames from "classnames";

// Import custom CSS for all stacks.
import "./Stack.css";

export default class OakStack extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
  }

  static contextTypes = {
    project: PropTypes.any
  }

  static childContextTypes = {
    stack: PropTypes.any
  };

  getChildContext() {
    return { stack: this };
  }


  // Add this stack to a project.
  // ASSUMES: `stack.cardMap` has already been set up (in our `index.js` file).
  // ASSUMES: `stack.components` has already been set up (in our `index.js` file).
  // ASSUMES: That this is being called from `Project.initializeProject()`
  static initialize({ stack, project, stackIndex }) {
    stack.project = project;
    stack.stackIndex = stackIndex;

    // Initialize cards.
    const cards = stack.cards;
    cards.forEach((card, cardIndex) => card.initialize({ card, stack, cardIndex }));

//console.info("stack after initializing:", stack);
    return stack;
  }


  //////////////////////////////
  // Syntactic sugar for deriving stuff
  //////////////////////////////
  static get cardIds() { return Object.keys(this.cardMap) }
  static get cards() { return this.cardIds.map(cardId => this.cardMap[cardId]) }
  static get id() { return this.defaultProps.id }
  static get title() { return this.defaultProps.title }
  static get path() { return this.project.path + "/" + this.id }
  static get prev() { return this.project.stacks[this.stackIndex - 1] }
  static get next() { return this.project.stacks[this.stackIndex + 1] }
  // Router for stack and its current set of cards
  // NOTE:  depends on `Stack.initialize()` being called (e.g. by `Project.initalize()`).
  static get route() {
    const cards = this.cards;
    const cardRoutes = [<IndexRoute component={cards[0]}/>, ...cards.map(card => card.route)];
    const routeProps = { path: this.id, component: this};
    return React.createElement(Route, routeProps, ...cardRoutes);
  }
  // All stack-accessible components, including project and theme
  // NOTE: if your stack has specific components, do the following in your `stack.jsx`:
  //    import * as components from "./components";
  //    export default class MyStack extends Stack {
  //      static _components = components;
  //      ...
  //     }
  static get components() { return Object.assign({}, this.project.components, this._components) }

  //////////////////////////////
  // Syntactic sugar for treating static things like instance things.
  //////////////////////////////

  // Return the project / stack CONSTRUCTORS (NOT instances).
  // (Really only useful for calling static methods).
  get project() { return this.constructor.project }
  get components() { return this.constructor.components }
  get cards() { return this.constructor.cards }

  // Reflection
  get id() { return this.constructor.id }
  get title() { return this.constructor.title }
  get path() { return this.constructor.path }

  // Return the PATH for the previous/next cards.
  // Returns `undefined` if we're at one end or the other.
  get prevStack() {
    const prev = this.constructor.prev;
    return (prev ? prev.path : undefined);
  }
  get nextStack() {
    const next = this.constructor.next;
    return (next ? next.path : undefined);
  }

  //////////////////////////////
  // Rendering
  //////////////////////////////

  render() {
    const { id, className, style } = this.props;
    const props = {
      id,
      className: classNames("oak Stack", className),
      style
    }
    return <div {...props}>{this.props.children}</div>;
  }

}

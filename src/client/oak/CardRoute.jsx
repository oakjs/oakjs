import React, { PropTypes } from "react";

import app from "./app";
import Stub from "./components/Stub";

export default class CardRoute extends React.Component {

  static childContextTypes = {
    app: PropTypes.any
  };

  getChildContext() {
    return { app };
  }

  render() {
    let { project: projectId, stack: stackId, card: cardId } = this.props.params;

    // default to first item if id not specified
    if (!projectId) projectId = 0;
    if (!stackId) stackId = 0;
    if (!cardId) cardId = 0;

    console.warn("CardRoute: ", projectId, stackId, cardId);

    const card = app.getCard(projectId, stackId, cardId);
    if (!card) {
      console.log("Card not found, loading it");
      app.loadCard(projectId, stackId, cardId)
        .then( () => {
          console.log("loaded card, updating ");
          this.forceUpdate();
        });

      return <Stub/>
    }

console.group("Got card ", card);
console.dir(card);
console.groupEnd();

    app.card = card;
    app.stack = card.stack;
    app.project = card.project;

    // ugh...
    card.app = app.stack.app = app.project.app = app;

    return React.createElement(card.project.ComponentConstructor);
  }
}

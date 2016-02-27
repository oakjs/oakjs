import React, { PropTypes } from "react";

import app from "./app";
import Stub from "./components/Stub";

export default class CardRoute extends React.Component {

  static childContextTypes = {
    app: PropTypes.any,
    project: PropTypes.any,
    stack: PropTypes.any,
    card: PropTypes.any,
    components: PropTypes.any
  };

  getChildContext() {
    return {
      app,
      project: app.project,
      stack: app.stack,
      card: app.card,
      components: (app.card ? app.card.components : app.components)
    };
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

      // if we're currently showing a card, keep that visible until we load
      if (app.card && app.card.project && app.card.project.isLoaded) {
        return React.createElement(app.card.project.ComponentConstructor);
      }
      // otherwise return a stub
      else {
        return <Stub/>
      }
    }

console.log("Got card ", card);
//console.dir(card);
//console.groupEnd();

    app.card = card;
    app.stack = card.stack;
    app.project = card.project;

    return React.createElement(card.project.ComponentConstructor);
  }
}

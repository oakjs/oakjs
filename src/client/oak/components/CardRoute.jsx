import React, { PropTypes } from "react";

import app from "../app";
import Stub from "./Stub";

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

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUpdate() {
    this._isMounted = false;
  }

  componentDidUpdate() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    // default to first item if id not specified
    let { projectId = 0, stackId = 0, cardId = 0} = this.props.params;

    console.warn("CardRoute: ", projectId, stackId, cardId);

    const card = app.getCard(projectId, stackId, cardId);
    if (card && card.isLoaded) {
      app.card = card;
      app.stack = card.stack;
      app.project = card.project;
    }
    else {
      if (!card || !card.isLoading) {
        app.loadCard(projectId, stackId, cardId)
          .then( card => {
            if (this._isMounted) {
              console.log("loaded card, updating ");
              this.forceUpdate();
            }
          })
          .catch(e => {
            console.log(`Card ${projectId}/${stackId}/${cardId} not found!!!`);
          });
      }
    }
    // if we're currently showing a card, keep that visible until we load
    if (app.card && app.card.project && app.card.project.isLoaded) {
      return React.createElement(app.card.project.Component);
    }
    // otherwise return a stub
    else {
      return <Stub/>
    }
  }
}

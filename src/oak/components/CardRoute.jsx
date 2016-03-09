import app from "../app";

import AppRoute from "./AppRoute";
import CurrentProject from "./CurrentProject";

export default class CardRoute extends AppRoute {
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
//           .catch(e => {
//             console.error(e);
//             console.log(`Card ${projectId}/${stackId}/${cardId} not found!!!`);
//           });
      }
    }
    // if we're currently showing a card, keep that visible until we load
    if (app.card && app.card.project) {
      return React.createElement(CurrentProject);
    }
    // otherwise return fals to tell react not to render yet.
    else {
      return false;
    }
  }
}

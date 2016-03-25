import app from "../app";

import AppRoute from "./AppRoute";
import CurrentProject from "./CurrentProject";

export default class CardRoute extends AppRoute {
  render() {
    // default to first item if id not specified
    let { projectId = 0, sectionId = 0, cardId = 0} = this.props.params;

    console.warn("CardRoute: ", projectId, sectionId, cardId);

    const card = app.getCard(projectId, sectionId, cardId);
    if (card && card.isLoaded) {
      app.card = card;
      app.section = card.section;
      app.project = card.project;
    }
    else {
      if (!card || !card.isLoading) {
        app.loadCard(projectId, sectionId, cardId)
          .then( card => {
            if (this._isMounted) {
              console.log("loaded card, updating ");
              this.forceUpdate();
            }
          })
//           .catch(e => {
//             console.error(e);
//             console.log(`Card ${projectId}/${sectionId}/${cardId} not found!!!`);
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

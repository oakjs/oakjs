//////////////////////////////
//
//  CardIndex class
//
//////////////////////////////

import objectUtil from "oak-roots/util/object";

import api from "./api";
import ComponentIndex from "./ComponentIndex";
import CardController from "./CardController";

export default class CardIndex extends ComponentIndex {
  constructor(...args) {
    super(...args);
    objectUtil.dieIfMissing(this, ["app", "stack", "path"]);
  }

  // Syntactic sugar for `loadComponent`
  loadCard(...args) {
    return this.loadComponent(...args);
  }

  _makeComponent(cardId, props) {
    return new CardController({
      app: this.app,
      stack: this.stack,
      props: {
        project: this.stack.projectId,
        stack: this.stack.id,
        card: cardId,
        ...props
      }
    });
  }

  //////////////////////////////
  //  Loading / Saving
  //////////////////////////////

  loadData() {
    return api.loadCardIndex(this)
    .then(index => {
      this.mutate({ index });
      return this;
    });
  }

  saveData() {
    return api.saveCardIndex(this)
  }

}

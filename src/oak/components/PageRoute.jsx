import app from "../app";

import AppRoute from "./AppRoute";
import CurrentProject from "./CurrentProject";

export default class PageRoute extends AppRoute {
  render() {
    // default to first item if id not specified
    let { projectId = 0, sectionId = 0, pageId = 0} = this.props.params;

    console.warn("PageRoute: ", projectId, sectionId, pageId);

    const page = app.getPage(projectId, sectionId, pageId);
    if (page && page.isLoaded) {
      app.page = page;
      app.section = page.section;
      app.project = page.project;
    }
    else {
      if (!page || !page.isLoading) {
        app.loadPage(projectId, sectionId, pageId)
          .then( page => {
            if (this._isMounted) {
              console.log("loaded page, updating ");
              this.forceUpdate();
            }
          })
//           .catch(e => {
//             console.error(e);
//             console.log(`Page ${projectId}/${sectionId}/${pageId} not found!!!`);
//           });
      }
    }
    // if we're currently showing a page, keep that visible until we load
    if (app.page && app.page.project) {
      return React.createElement(CurrentProject);
    }
    // otherwise return fals to tell react not to render yet.
    else {
      return false;
    }
  }
}

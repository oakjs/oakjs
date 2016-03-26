import app from "oak/app";
import RunnerProject from "oak/components/RunnerProject";

import AppRoute from "./AppRoute";

function _normalizeInt(value) {
  if (typeof value === "string") {
    const intValue = parseInt(value, 10);
    if (""+intValue === value) return intValue;
  }
  return value;
}

export default class UIRoute extends AppRoute {
  render() {

    // get params from the URL and extra stuff stuck directly on the <Route> object
    const params = Object.assign({}, this.props.params, this.props.route);
    console.dir(params);

    //
    // attempt to load the UI Page
    //
    const { uiProjectId = "_ui", uiSectionId = "player", uiPageId = "runner" } = params;
    const uiPage = app.getPage(uiProjectId, uiSectionId, uiPageId);
    // if we got a loaded page:
    if (uiPage && uiPage.isLoaded) {
      // assign it to `app.ui.page` so we'll show it below
      app.ui.page = uiPage;
      app.ui.section = uiPage.section;
      app.ui.project = uiPage.project;
    }
    else {
      // Otherwise if we didn't get a page, or the page hasn't started loading yet
      if (!uiPage || !uiPage.isLoading) {
        // load it and then redraw
        app.loadPage(uiProjectId, uiSectionId, uiPageId)
          .then( page => {
            if (this._isMounted) {
              console.log("loaded ui page, updating ");
              this.forceUpdate();
            }
          })
//           .catch(e => {
//             console.error(e);
//             console.log(`Page ${uiProjectId}/${uiSectionId}/${uiPageId} not found!!!`);
//           });
      }
    }

    //
    // attempt to load the App Page
    //
    // NOTE: account for numeric indexes sent as params
    const appProjectId = _normalizeInt(params.appProjectId);
    const appSectionId = _normalizeInt(params.appSectionId);
    const appPageId = _normalizeInt(params.appPageId);

    if (uiPage && appProjectId !== undefined) {
      const appPage = app.getPage(appProjectId, appSectionId, appPageId);
      // if we got a loaded page
      if (appPage && appPage.isLoaded) {
        // assign it to `app.page` so `<CurrentPage>` will show it
        app.page = appPage;
        app.section = appPage.section;
        app.project = appPage.project;
      }
      else {
        // Otherwise if we didn't get a page, or the page hasn't started loading yet
        if (!appPage || !appPage.isLoading) {
          // load it and then redraw
          app.loadPage(appProjectId, appSectionId, appPageId)
            .then( page => {
              if (this._isMounted) {
                console.log("loaded app page, updating ");
                this.forceUpdate();
              }
            })
  //           .catch(e => {
  //             console.error(e);
  //             console.log(`Page ${appProjectId}/${appSectionId}/${appPageId} not found!!!`);
  //           });
        }
      }
    }

    // if we're currently showing a page, keep that visible until we load
    if (app.ui.page && app.ui.page.project) {
      return React.createElement(RunnerProject, params);
    }
    // otherwise return `false` to tell react not to render yet.
    else {
      return false;
    }
  }
}

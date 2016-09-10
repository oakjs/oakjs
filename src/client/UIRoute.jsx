import oak from "oak/oak";
import { RunnerProject } from "oak/components/ComponentProxy";

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
//    console.dir(params);

    //
    // attempt to load the runner Page
    //
    const { runnerProjectId = "_runner", runnerSectionId = "player", runnerPageId = "showPage" } = params;
    const runnerPage = oak.account.getPage(runnerProjectId, runnerSectionId, runnerPageId);
    // if we got a loaded page:
    if (runnerPage && runnerPage.isLoaded) {
      // assign it to `oak.runner.page` so we'll show it below
      oak.runner.page = runnerPage;
      oak.runner.section = runnerPage.section;
      oak.runner.project = runnerPage.project;
    }
    else {
      // Otherwise if we didn't get a page, or the page hasn't started loading yet
      if (!runnerPage || !runnerPage.isLoading) {
        // load it and then redraw
        oak.account.loadPage(runnerProjectId, runnerSectionId, runnerPageId)
          .then( page => {
            if (this._isMounted) {
              console.log("loaded runner page, updating ");
              this.forceUpdate();
            }
          })
//           .catch(e => {
//             console.error(e);
//             console.log(`Page ${runnerProjectId}/${runnerSectionId}/${runnerPageId} not found!!!`);
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

    if (runnerPage && appProjectId !== undefined) {
      const appPage = oak.account.getPage(appProjectId, appSectionId, appPageId);
      // if we got a loaded page
      if (appPage && appPage.isLoaded) {
        // assign it to `oak.page` so `<CurrentPage>` will show it
        oak.page = appPage;
        oak.section = appPage.section;
        oak.project = appPage.project;
      }
      else {
        // Otherwise if we didn't get a page, or the page hasn't started loading yet
        if (!appPage || !appPage.isLoading) {
          // load it and then redraw
          oak.account.loadPage(appProjectId, appSectionId, appPageId)
            .then( page => {
              if (this._isMounted) {
                console.log("loaded oak page, updating ");
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
    if (oak.runner.page && oak.runner.page.project) {
      return React.createElement(RunnerProject, params);
    }
    // otherwise return `false` to tell react not to render yet.
    else {
      return false;
    }
  }
}

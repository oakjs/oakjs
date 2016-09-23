//////////////////////////////
//
//  Application router.
//
//////////////////////////////


import React, { PropTypes } from "react";
import { Router, Route, IndexRoute } from "react-router";

import PageRoute from "./PageRoute";

// Set up History.
import { useQueries, createHistory } from "history";
const history = useQueries(createHistory)();

const routes = (
  <Route path="/">
    <Route path="project" component={PageRoute} />
    <Route path="project/:appProjectId" component={PageRoute} runnerPageId="projectThumbs" />
    <Route path="project/:appProjectId/:appSectionId" component={PageRoute} />
    <Route path="project/:appProjectId/:appSectionId/:appPageId" component={PageRoute} />

    <IndexRoute component={PageRoute} runnerPageId="projectSelector" />
    <Route path="*" component={PageRoute} runnerPageId="projectSelector" />
  </Route>
);

// Set up the router
const router = React.createElement(Router, { history }, routes);
export default router;

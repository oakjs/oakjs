//////////////////////////////
//
//  Application router.
//
//////////////////////////////


import React, { PropTypes } from "react";
import { Router, Route, IndexRoute } from "react-router";

import UIRoute from "./UIRoute";

// Set up History.
import { useQueries, createHistory } from "history";
const history = useQueries(createHistory)();

const routes = (
  <Route path="/">
    <Route path="project" component={UIRoute} appProjectId={1} appSectionId={1} appPageId={1} />
    <Route path="project/:appProjectId" component={UIRoute} appSectionId={1} appPageId={1} />
    <Route path="project/:appProjectId/:appSectionId" component={UIRoute} appPageId={1} />
    <Route path="project/:appProjectId/:appSectionId/:appPageId" component={UIRoute} />

    <IndexRoute component={UIRoute} runnerPageId="projectSelector" />
    <Route path="*" component={UIRoute} runnerPageId="projectSelector" />
  </Route>
);

// Set up the router
const router = React.createElement(Router, { history }, routes);
export default router;

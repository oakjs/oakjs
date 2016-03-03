//////////////////////////////
//
//  Application router.
//
//////////////////////////////


import React, { PropTypes } from "react";
import { Router, Route } from "react-router";

import AppRoot from "oak/components/AppRoot";
import CardRoute from "oak/components/CardRoute";

// Set up History.
import { useQueries, createHistory } from "history";
const history = useQueries(createHistory)();

const routes = (
  <Route path="/" component={AppRoot}>
    <Route path="project" component={CardRoute} />
    <Route path="project/:projectId" component={CardRoute} />
    <Route path="project/:projectId/:stackId" component={CardRoute} />
    <Route path="project/:projectId/:stackId/:cardId" component={CardRoute} />
  </Route>
);

// Set up the router
const router = React.createElement(Router, { history }, routes);
export default router;

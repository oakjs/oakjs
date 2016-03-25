//////////////////////////////
//
//  Application router.
//
//////////////////////////////


import React, { PropTypes } from "react";
import { Router, Route } from "react-router";

import PageRoute from "oak/components/PageRoute";

// Set up History.
import { useQueries, createHistory } from "history";
const history = useQueries(createHistory)();

const routes = (
  <Route path="/" component={PageRoute}>
    <Route path="project" component={PageRoute} />
    <Route path="project/:projectId" component={PageRoute} />
    <Route path="project/:projectId/:sectionId" component={PageRoute} />
    <Route path="project/:projectId/:sectionId/:pageId" component={PageRoute} />
  </Route>
);

// Set up the router
const router = React.createElement(Router, { history }, routes);
export default router;

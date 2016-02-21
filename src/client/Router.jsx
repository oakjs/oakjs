//////////////////////////////
//
//  Application router.
//
//////////////////////////////


import React from "react";
import { Router, Route } from "react-router";

import oldProjectsRoute from "./projectRoutes";

// Set up History.
import { useQueries, createHistory } from "history";
const history = useQueries(createHistory)();
//import createHistory from "history/lib/createHashHistory"
//const history = createHistory();

const routes = (
  <Route path="/">
    {oldProjectsRoute}
  </Route>
);


// Set up the router
const router = React.createElement(Router, { history }, routes);
export default router;

// DEBUG
window.router = router;

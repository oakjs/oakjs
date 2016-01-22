import React from "react";
import { Router, Route } from "react-router";
//import { useQueries, createHistory } from "history";
import createHistory from "history/lib/createHashHistory"

import ProjectsRoutes from "projects/routes";

//const history = useQueries(createHistory)();
const history = createHistory();
export default (
  <Router history={ history }>
    {ProjectsRoutes}
  </Router>
);

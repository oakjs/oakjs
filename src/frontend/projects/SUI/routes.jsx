import React from "react";
import { Route, IndexRoute } from "react-router";

import SUIProject from "./project.jsx";
import { default as ExamplesRoutes } from "./stacks/examples/routes";

const ProjectRoutes = (
  <Route path="SUI" component={SUIProject}>
    {ExamplesRoutes}
  </Route>
);
export default ProjectRoutes;

import React from "react";
import { Route, IndexRoute } from "react-router";

// Import projects and set up project routes
import { default as SUIRoutes } from "projects/SUI/routes";

// Default route has to be specified here... :-(
import SUIProject from "projects/SUI/project";

const ProjectsRoutes = (
  <Route path="/">
    <IndexRoute component={SUIProject}/>
    {SUIRoutes}
  </Route>
);
export default ProjectsRoutes;

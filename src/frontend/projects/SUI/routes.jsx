import React from "react";
import { Route, IndexRoute } from "react-router";

import ExamplesStack from "./stacks/examples/stack.jsx";
import ExamplesRoutes from "./stacks/examples/routes";

const ProjectRoutes = (
  <Route>
    <IndexRoute component={ExamplesStack}/>
    <Route path="examples" component={ExamplesStack}>
      {ExamplesRoutes}
    </Route>
  </Route>
);
export default ProjectRoutes;

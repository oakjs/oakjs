import React from "react";
import { Route, IndexRoute } from "react-router";

import SUIProject from "./SUI/project.jsx";
import ExamplesStack from "./SUI/stacks/examples/stack.jsx";
import ButtonCard from "./SUI/stacks/examples/cards/Button/card.jsx";
import ButtonGroupCard from "./SUI/stacks/examples/cards/ButtonGroup/card.jsx";
import DropdownCard from "./SUI/stacks/examples/cards/Dropdown/card.jsx";


const ProjectsRoutes = (
  <Route path="/">
    <IndexRoute component={SUIProject}/>
    <Route path="SUI" component={SUIProject}>
      <Route path="examples" component={ExamplesStack}>
        <Route path="Button" component={ButtonCard}/>
        <Route path="ButtonGroup" component={ButtonGroupCard}/>
        <Route path="Dropdown" component={DropdownCard}/>
      </Route>
    </Route>
  </Route>
);
export default ProjectsRoutes;

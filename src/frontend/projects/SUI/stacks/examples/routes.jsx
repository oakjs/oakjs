import React from "react";
import { Route, IndexRoute } from "react-router";

import ButtonCard from "./cards/Button/card.jsx";
import ButtonGroupCard from "./cards/ButtonGroup/card.jsx";
import DropdownCard from "./cards/Dropdown/card.jsx";

const StackRoutes = (
  <Route>
    <IndexRoute component={ButtonCard}/>
    <Route path="Button" component={ButtonCard}/>
    <Route path="ButtonGroup" component={ButtonGroupCard}/>
    <Route path="Dropdown" component={DropdownCard}/>
  </Route>
);
export default StackRoutes;

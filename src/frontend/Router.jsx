import React from "react";
import { Router, Route } from "react-router";
import { createHistory } from "history";

import SUIProject from "projects/SUI/project";

const { history } = createHistory();
export default function AppRouter() {
  return (
    <Router history={ history }>
      <Route path="/" component={ SUIProject } />
    </Router>
  );
}

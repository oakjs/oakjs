//////////////////////////////
//
//  Application router.
//
//////////////////////////////


import React from "react";
import { Router, Route } from "react-router";

// Set up History.
console.warn("TODO: get express/webpack working properly so we can use non-hash history.");
//import { useQueries, createHistory } from "history";
//const history = useQueries(createHistory)();
import createHistory from "history/lib/createHashHistory"
const history = createHistory();

// Import projects.
// NOTE: this is what pulls ALL of the projects/etc into scope!!!
import * as projectMap from "./projects";
const projects = Object.keys(projectMap).map(projectId => projectMap[projectId]);
const projectRoutes = projects.map(project => project.route);

// Set up the router
const topLevelRoute = React.createElement(Route, { path: "/" }, ...projectRoutes);
const router = React.createElement(Router, { history }, topLevelRoute);
export default router;

// DEBUG
window.router = router;
window.projects = projects;
window.project = projects[0];

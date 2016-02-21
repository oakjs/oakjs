import React from "react";
import { Router, Route } from "react-router";

// Import projects.
// NOTE: this is what pulls ALL of the projects/etc into scope!!!
import * as projectMap from "../projects";
const projects = Object.keys(projectMap).map(projectId => projectMap[projectId]);
const projectRoutes = projects.map(project => project.route);

const projectsRoute = <Route path="projects">{projectRoutes}</Route>
export default projectsRoute;

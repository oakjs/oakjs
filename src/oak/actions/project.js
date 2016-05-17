//////////////////////////////
//  Project Actions
//////////////////////////////
"use strict";

import { die, dieIfMissing } from "oak-roots/util/die";

import Account from "../Account";
import Project from "../Project";
import oak from "../oak";

import component from "./component";
import navigation from "./navigation";
import utils from "./utils";

// set to `true` to log messages as actions proceed
const DEBUG = true;



// Show some project.
export function showProject(options = {}) {
  let {
    project = oak.project,            // Project or project path, defaults to current project
    replace,
    actionName = "Show Project",
    autoExecute
  } = options;

  // normalize project to path string
  if (project instanceof Project) project = project.path;
  if (typeof project !== "string") die(oak, "actions.showProject", [options], "you must specify a project");

  const { projectId } = Project.splitPath(project);

  return navigation._navigateToRouteTransaction({
    route: oak.getPageRoute(projectId),
    replace,
    actionName,
    autoExecute
  })
}


// Show first / previous / next / first / last project
// Same options as `showProject`
export function showFirstProject(options) { return _showRelativeProject("FIRST", options); }
export function showPreviousProject(options) { return _showRelativeProject("PREV", options); }
export function showNextProject(options) { return _showRelativeProject("NEXT", options); }
export function showLastProject(options) { return _showRelativeProject("LAST", options); }

function _showRelativeProject(which, options = {}) {
  let { project = oak.project } = options;
  if (!project) return;

  if (which === "FIRST")        project = project.project.firstChild;
  else if (which === "PREV")    project = project.previous;
  else if (which === "NEXT")    project = project.next;
  else if (which === "LAST")    project = project.project.lastChild;

  const showProjectOptions = Object.assign({ project }, options);
  return showProject(showProjectOptions);
}


// Save the project to the server.
// NOTE: this is currently not undoable.
// TODO: this doesn't return a transaction, so can't be used in other undo contexts... ???
export function saveProject(options = {}) {
  let {
    project = oak.project
  } = options;

  // normalize project to Project object
  if (typeof project === "string") project = oak.account.getProject(project);
  if (!project) die(oak, "actions.savePage", [options], "you must specify a project");

  return project.save("FORCE");
}


//////////////////////////////
//  Rename project (change it's id)
//////////////////////////////
export function renameProject(options = {}) {
  let {
    project = oak.project,  // Project to change
    newId,                  // New id for the project
    prompt,                 // If `true`, we'll prompt for a new name if newId is not set.
    actionName,
    autoExecute
  } = options

  // normalize project to Project object
  if (typeof project === "string") project = oak.account.getProject(project);
  if (!project) die(oak, "actions.renameProject", [options], "you must specify a project");

  return component._renameComponentTransaction({
    component: project,
    newId,
    updateInstance: function(component, id) { component.projectId = id },
    navigate: (project === oak.project),
    actionName,
    autoExecute
  });
}


//////////////////////////////
//  Delete project.  Undoing adds the project back.
//////////////////////////////
export function deleteProject(options = {}) {
  let {
    project = oak.project,    // Project to delete as Project object or path.
    confirm,
    actionName,
    autoExecute
  } = options;

  // normalize project to Project object
  if (typeof project === "string") project = oak.account.getProject(project);
  if (!project) die(oak, "actions.deleteProject", [options], "you must specify a project");

  return component._deleteComponentTransaction({
    component: project,
    navigate: (project == oak.project),   // navigate if showing the project
    confirm,
    actionName,
    autoExecute
  });
}



//////////////////////////////
//  Add project.  Undoing deletes the new project.
//////////////////////////////
export function createProject(options = {}) {
  let {
    account = oak.account,    // default to current account
    projectId,                // id for the project (we'll make one up if necessary)
    data,                     // data object for project with `{ jsxe, script, styles, index }`
    position,                 // numeric position within the project, undefined = place after current project
    title,                    // title for the project
    prompt = true,            // if true and title is not specified, we'll prompt for project title
    navigate = true,          // if true, we'll navigate to the project after creation
    actionName,
    autoExecute
  } = options;

  // ensure account is an Account object
  if (!(account instanceof Account)) die(oak, "actions.createProject", [options], "you must specify an account");

  // place after current project by default
  if (!position && oak.project) position = oak.project.position + 1;

  return component._createComponentTransaction({
    parent: account,
    type: "project",
    newId: projectId,
    title,
    prompt,
    data,
    position,
    navigate,
    actionName,
    autoExecute
  });
}


//////////////////////////////
//  Duplicate some project.  Undoing deletes the new project.
//////////////////////////////
export function duplicateProject(options = {}) {
  let {
    project = oak.project,          // default to current project
    projectId,
                                    // default to project's name, duplicateProject will uniquify.
    position,                       // numeric position within the project, undefined = place after current project
    title,                          // title for the new project, defaults to same as current project
    prompt,                         // if true and title is not specified, we'll prompt for project title
    navigate,                       // if true, we'll navigate to the project after creation
    actionName = "Duplicate Project",
    autoExecute
  } = options;

  // normalize project to Project object
  if (typeof project === "string") project = oak.account.getProject(project);
  if (!project) die(oak, "actions.duplicateProject", [options], "you must specify a project");

  return component._duplicateComponentTransaction({
    component: project,
    newId: projectId,
    position,
    title,
    prompt,
    navigate,
    actionName,
    autoExecute
  });
}

// Export all as a lump
export default Object.assign({}, exports);

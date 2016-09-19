//////////////////////////////
//  Project Actions
//////////////////////////////
"use strict";

import Action from "oak-roots/Action";
import { die, dieIfMissing } from "oak-roots/util/die";

import Account from "../Account";
import ComponentController from "../ComponentController";
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

  // handle relative project identifier
  if (project === "FIRST") project = oak.account.projectIndex.firstChild;
  else if (project === "PREV") project = oak.project && oak.project.previous;
  else if (project === "NEXT") project = oak.project && oak.project.next;
  else if (project === "LAST") project = oak.account.projectIndex.lastChild

  if (project === oak.project) return;
  if (!project) return;

  // normalize project to path string
  if (project instanceof Project) project = project.path;
  if (typeof project !== "string") die(oak, "actions.showProject", [options], "you must specify a project");

  const { projectId } = Account.splitPath(project);

  return navigation._navigateToRouteTransaction({
    route: oak.account.getPageRoute(projectId),
    replace,
    actionName,
    autoExecute
  })
}

new Action({
  id: "oak.showFirstProject", title: "Show First Project",
  handler: () => showProject({ project: "FIRST" }),
  hidden: () => oak.projectCount < 3,
  disabled: () => !oak.project || oak.project.isFirst
});

new Action({
  id: "oak.showPreviousProject", title: "Show Previous Project",
  handler: () => showProject({ project: "PREV" }),
  hidden: () => oak.projectCount < 2,
  disabled: () => !oak.project || oak.project.isFirst
});

new Action({
  id: "oak.showNextProject", title: "Show Next Project",
  handler: () => showProject({ project: "NEXT" }),
  hidden: () => oak.projectCount < 2,
  disabled: () => !oak.project || oak.project.isLast
});

new Action({
  id: "oak.showLastProject", title: "Show Last Project",
  handler: () => showProject({ project: "LAST" }),
  hidden: () => oak.projectCount < 3,
  disabled: () => !oak.project || oak.project.isLast
});



//////////////////////////////
//  Save a project
//////////////////////////////

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

new Action({
  id: "oak.saveProject", title: "Save Project",
  handler: saveProject,
  disabled: () => !oak.project
});





//////////////////////////////
//  Create new project.  Undoing deletes the new project.
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
  if (!(account instanceof Account)) die(oak, "actions.createProject", [options], "you must specify an Account");

  // place after current project by default
  if (position == null && oak.project) position = oak.project.position + 1;

  return component._createComponentTransaction({
    parent: account,
    type: "Project",
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

new Action({
  id: "oak.createProject", title: "New Project...",
  handler: createProject,
});


//////////////////////////////
//  Create new project-level custom component.  Undoing deletes the new component.
//////////////////////////////
export function createComponent(options = {}) {
  let {
    parent = oak.project,     // default to current project (but in theory any parent would work)
    componentId,              // id for the component (we'll make one up if necessary)
    data,                     // optional data object for component with `{ jsxe, script, styles, index }`
    position,                 // numeric position within the parent, undefined = place at the end
    title,                    // title for the component
    prompt = true,            // if true and title is not specified, we'll prompt for component title
    actionName,
    autoExecute
  } = options;

  // ensure account is an Account object
  if (!(parent instanceof ComponentController)) die(oak, "actions.createComponent", [options], "you must specify a ComponentController");

  // place after last item in parent by default
  if (position == null && parent.childIndex) position = parent.childIndex.length;

  return component._createComponentTransaction({
    parent,
    type: "Component",
    newId: componentId,
    title,
    prompt,
    data,
    position,
    actionName,
    autoExecute
  });
}

new Action({
  id: "oak.createComponent", title: "New Component...",
  handler: createComponent,
});


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

new Action({
  id: "oak.duplicateProject", title: "Duplicate Project...",
  handler: duplicateProject,
  disabled: () => !oak.project
});


//////////////////////////////
//  Rename project (change it's title + id)
//////////////////////////////
export function renameProject(options = {}) {
  let {
    project = oak.project,  // Project to change
    newTitle,               // New title for the project.  Will be generated from `newTitle` if not provided.
    newId,                  // New id for the project.  Will be generated from `newTitle` if not provided.
    prompt,                 // If `true`, we'll prompt for a new name if neither `newTitle` nor `newId` is set.
    actionName,
    autoExecute
  } = options

  // normalize project to Project object
  if (typeof project === "string") project = oak.account.getProject(project);
  if (!project) die(oak, "actions.renameProject", [options], "you must specify a project");

  return component._renameComponentTransaction({
    component: project,
    newTitle,
    newId,
    updateInstance: function(component, id) { component.projectId = id },
    prompt,
    navigate: (project === oak.project),
    actionName,
    autoExecute
  });
}

new Action({
  id: "oak.renameProject", title: "Rename Project...",
  handler: renameProject,
  disabled: () => !oak.project
});


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

new Action({
  id: "oak.deleteProject", title: "Delete Project",
  handler: deleteProject,
  disabled: () => !oak.project
});


// Export all as a lump
export default Object.assign({}, exports);

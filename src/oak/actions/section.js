//////////////////////////////
//  Section Actions
//////////////////////////////
"use strict";

import { die, dieIfMissing } from "oak-roots/util/die";

import Section from "../Section";
import oak from "../oak";

import component from "./component";
import navigation from "./navigation";
import utils from "./utils";

// set to `true` to log messages as actions proceed
const DEBUG = true;



// Show some section.
export function showSection(options = {}) {
  let {
    section = oak.section,            // Section or section path, defaults to current section
    replace,
    actionName = "Show Section",
    autoExecute
  } = options;

  // normalize section
  if (section instanceof Section) section = section.path;
  if (typeof section !== "string") die(oak, "actions.showSection", [options], "you must specify a section");

  const { projectId, sectionId } = Section.splitPath(section);

  return navigation._navigateToRouteTransaction({
    route: oak.getPageRoute(projectId, sectionId),
    replace,
    actionName,
    autoExecute
  })
}


// Show first / previous / next / first / last section
export function showFirstSection(options) { return _showRelativeSection("FIRST", options); }
export function showPreviousSection(options) { return _showRelativeSection("PREV", options); }
export function showNextSection(options) { return _showRelativeSection("NEXT", options); }
export function showLastSection(options) { return _showRelativeSection("LAST", options); }

function _showRelativeSection(which, options) {
  if (!oak.section) return;

  let section;
  if (which === "FIRST")        section = oak.section.project.firstChild;
  else if (which === "PREV")    section = oak.section.previous;
  else if (which === "NEXT")    section = oak.section.next;
  else if (which === "LAST")    section = oak.section.project.lastChild;

  const showSectionOptions = Object.assign({ section }, options);
  return showSection(showSectionOptions);
}


// Save the section to the server.
// NOTE: this is currently not undoable.
// TODO: this doesn't return a transaction, so can't be used in other undo contexts... ???
export function saveSection(options = {}) {
  let {
    section = oak.section
  } = options;

  // normalize section
  if (typeof section === "string") section = oak.getSection(section);
  if (!section) die(oak, "actions.savePage", [options], "you must specify a section");

  return section.save("FORCE");
}


//////////////////////////////
//  Rename section (change it's id)
//////////////////////////////
export function renameSection(options = {}) {
  let {
    section = oak.section,  // Section to change
    newId,                  // New id for the section
    prompt,                 // If `true`, we'll prompt for a new name if newId is not set.
    actionName,
    autoExecute
  } = options

  // normalize section
  if (typeof section === "string") section = oak.getSection(section);
  if (!section) die(oak, "actions.renameSection", [options], "you must specify a section");

  return component._renameComponentTransaction({
    component: section,
    newId,
    updateInstance: function(component, id) { component.sectionId = id },
    navigate: (section === oak.section),
    actionName,
    autoExecute
  });
}


//////////////////////////////
//  Delete section.  Undoing adds the section back.
//////////////////////////////
export function deleteSection(options = {}) {
  let {
    section = oak.section,    // Section to delete as Section object or path.
    confirm,
    actionName,
    autoExecute
  } = options;

  // normalize section
  if (typeof section === "string") section = oak.getSection(section);
  if (!section) die(oak, "actions.deleteSection", [options], "you must specify a section");

  return component._deleteComponentTransaction({
    component: section,
    navigate: (section == oak.section),   // navigate if showing the section
    confirm,
    actionName,
    autoExecute
  });
}



//////////////////////////////
//  Add section.  Undoing deletes the new section.
//////////////////////////////
export function createSection(options = {}) {
  let {
    project = oak.project,    // default to current project
    sectionId,                // id for the section (we'll make one up if necessary)
    data,                     // data object for section with `{ jsxe, script, styles, index }`
    position = oak.section && oak.section.position + 1,
                              // 1-based numeric position within the project, undefined = place after current section
    title,                    // title for the section
    prompt = true,            // if true and title is not specified, we'll prompt for section title
    navigate = true,          // if true, we'll navigate to the section after creation
    actionName,
    autoExecute
  } = options;

  // normalize project
  if (typeof project === "string") project = oak.getProject(project);
  if (!project) die(oak, "actions.createSection", [options], "you must specify a project");

  return component._createComponentTransaction({
    parent: project,
    type: "section",
    newId: sectionId,
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
//  Duplicate some section.  Undoing deletes the new section.
//////////////////////////////
export function duplicateSection(options = {}) {
  let {
    section = oak.section,          // default to current section
    sectionId = section && section.sectionId,
                                    // default to section's id, createSection will uniquify.
    position,                       // 1-based numeric position within the project, undefined = place after current section
    title,                          // title for the new section, defaults to same as current section
    navigate,                       // if true, we'll navigate to the section after creation
    actionName = "Duplicate Section",
    autoExecute
  } = options;

  if (!section) die(oak, "actions.duplicateSection", [options], "section not found");

  return createSection({
    project: section.project,
    sectionId,
    data: section.getDataToSave(),
    position,
    title: title || section.title,
    navigate,
    actionName,
    autoExecute
  });
}

// Export all as a lump
export default Object.assign({}, exports);

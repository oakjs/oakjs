//////////////////////////////
//  Actions for dealing with sections
//////////////////////////////
"use strict";

import ids from "oak-roots/util/ids";
import { die,  } from "oak-roots/util/die";
import { UndoTransaction } from "oak-roots/UndoQueue";

import api from "../api";
import JSXFragment from "../JSXFragment";
import Section from "../Section";
import oak from "../oak";

import utils from "./utils";


// set to `true` to log messages as actions proceed
const DEBUG = true;


// Save the section to the server.
// NOTE: this is currently not undoable.
// TODO: this doesn't return a transaction, so can't be used in other undo contexts... ???
export function saveSection() {
  return oak.section.save("FORCE");
}


//////////////////////////////
//  Change section id -- requires disk changes.
//////////////////////////////

// Change a section's id.
export function renameSection(options = {}) {
  let {
    path = oak.section && oak.section.path,     // Path for section to change
    toId,                                 // New id for the section
    prompt = true,                        // If `true` and `toId` is not specified, we'll ask.
    actionName = "Rename Section", autoExecute
  } = options
  // check parameters
  if (typeof path !== "string") die(oak, "actions.renameSection", [options], "you must specify options.path");

  // try to get the section (it's ok if we can't)
  const section = oak.getSection(path);

  // if `toId` was not specified, prompt
  if (!toId && prompt) {
    toId = window.prompt("New name for section?", section && section.sectionId);
    if (!toId) return;
  }
  if (!toId) die(oak, "actions.renameSection", [options], "you must specify options.toId");

  const { projectId, sectionId:originalSectionId } = Section.splitPath(path);
  const toPath = Section.getPath(projectId, toId);

  // Only navigate if we're showing the same section
  const navigate = (oak.section && oak.section.path === path);

  return new UndoTransaction({
    redoActions:[ () => _renameSection({ path, toId, navigate }) ],
    undoActions:[ () => _renameSection({ path: toPath, toId: originalSectionId, navigate }) ],
    actionName,
    autoExecute
  });
}

// Internal routine to actually rename and possibly navigate.
// No parameter normalization!
function _renameSection({ path, toId, navigate }) {
  if (DEBUG) console.info(`_renameSection({ path: ${path}, toId: ${toId}, navigate: ${navigate}  })`);
  return api.changeComponentId({
      type: "section",
      path,
      toId
    })
    // response returns the project's sectionIndex JSON data
    .then( sectionIndexJSON => {
      const section = oak.getSection(path);
      if (!section) {
        // it's not necessarily an error if we can't find the section, just warn and continue
        console.warn(`actions._renameSection(${path}): id changed but section not found`);
        return Promise.resolve();
      }
      // NOTE: the order is important here!
      // 1: changeId() in the project sectionIndex
      section.project.sectionIndex.changeId(section.sectionId, toId);

      // 2: update section in place
      section.sectionId = toId;

      // 3: update project sectionIndex with data we got back
      section.project.sectionIndex.loaded(sectionIndexJSON);

console.info("section id changed" + (navigate ? ", navigating..." : ""));
      // navigate if desired
      if (navigate) {
        utils.navigateToRoute(section.route, "REPLACE");
      }
    });
}


//////////////////////////////
//  Remove section.  Undoing adds the section back.
//////////////////////////////

export function deleteSection(options = {}) {
  let {
    section = oak.section,                // Section to delete as Section object or path.
    confirm = !oak.event.optionKey, // If `true`, we'll show a confirm dialog before deleting.
                                    // Default is to confirm unless the option key is down.
    actionName = "Delete Section", autoExecute
  } = options;

  if (typeof section === "string") section = oak.getSection(section);
  if (!section) die(oak, "actions.deleteSection", [options], "you must specify options.section");

  // try to go to the section after, if that doesn't work, we're at the end, go to the one before
  // If we don't get anything, this is the only section in the project
// TODO: can't delete only section in the project -- ask if they want to delete project?
  const nextSection = section.project.getSection(section.position + 1) || section.project.getSection(section.position - 1);

  if (confirm) {
    // TODO: confirm with a nicer alert
    const answer = window.confirm(`Really delete section ${section.title}?`);
    if (answer === false) return;
  }

  // get the old section data for undo
  const path = section.path;

  // Only navigate if we're on the same section
  const navigate = (section === oak.section);

  // get parameter data BEFORE creating transaction
  const deleteParams = {
    path,
    route: navigate && nextSection && nextSection.route
  }

  const createParams = {
    path,
    title: section.title,
    data: section.getDataToSave(),
    position: section.position,
    navigate
  };

  return new UndoTransaction({
    redoActions:[ () => _deleteSection(deleteParams) ],
    undoActions:[ () => _createSection(createParams) ],
    actionName,
    autoExecute
  });
}
// Internal routine to actually delete the section.
// No parameter normalization or checking!
function _deleteSection({ path, route }) {
  if (DEBUG) console.info(`_deleteSection({ path: ${path}, route: ${route} })`);
  return api.deleteComponent({ type: "section", path })
    // response returns the sectionIndex JSON data
    .then( sectionIndexJSON => {
      // update the project's sectionIndex data, which should remove the section from the index
      const project = oak.getProject(path);
      if (project) project.sectionIndex.loaded(sectionIndexJSON);

      // navigate
      if (route) utils.navigateToRoute(route, "REPLACE");
    });
}




//////////////////////////////
//  Add section.  Undoing removes the section.
//////////////////////////////
export function createSection(options = {}) {
  let {
    projectId = oak.section && oak.section.projectId,   // default to current
    sectionId,
    title,            // optional: title for the section (DEFAULT???)
    data,             // optional: data object for section with `{ jsxe, script, styles }`
    position = oak.section && oak.section.position + 1, // optional: 1-based numeric position within the project, undefined = place after current section
    prompt = true,    // optional: if true and title is not specified, we'll prompt for section title
    navigate = true,  // optional: if true, we'll navigate to the section after creation
    actionName = "New Section", autoExecute
  } = options;

  // verify that project/section exist
  const project = oak.getProject(projectId);
  if (!project) die(oak, "actions.createSection", [options], "project not found");

  // prompt for title if necessary
  if (!title && prompt) {
    title = window.prompt("Name for new section?", "Untitled") || "";
  }

  if (!sectionId) {
    if (title)  sectionId = ids.normalizeIdentifier(title);
    else        sectionId = JSXFragment.getRandomOid();
  }

  // make sure sectionId is unique within it's project
  sectionId = project.uniquifySectionId(sectionId);

  const path = Section.getPath(projectId, sectionId);
  const currentRoute = (navigate ? oak.section && oak.section.route : undefined);

  // get parameter data BEFORE creating transaction
  const createParams = {
    path,
    title,
    data,
    position,
    navigate
  };

  // On undo, go back to the current section if we're navigating
  const deleteParams = {
    path,
    route: navigate && oak.section && oak.section.route
  }

  return new UndoTransaction({
    redoActions:[ () => _createSection(createParams) ],
    undoActions:[ () => _deleteSection(deleteParams) ],
    actionName,
    autoExecute
  });
}
// Internal routine to actually create the section.
// NOTE: it's up to you to make sure there's not already a section at `path`!
// No parameter normalization or checking!
function _createSection({ path, title, data, position, navigate }) {
  if (DEBUG) console.info(`_createSection({ path: ${path}, title: ${title}, data: ${data}, position: ${position}, navigate: ${navigate} })`);
  return api.createComponent({ type: "section", path, title, data, position })
    // returns json with:  `{ index, item }`
    .then( ({ index: sectionIndexData, item: sectionData }) => {
      const project = oak.getProject(path);
      if (!project) {
        // it's not necessarily an error if we can't find the section, just warn and continue
        console.warn(`actions._createSection(${path}): server section created but project not found`);
        return Promise.resolve();
      }
      // ORDER is important:
      // 1. update the project's sectionIndex
      project.sectionIndex.loaded(sectionIndexData);

      // 2. get the new section
      const section = oak.getSection(path);
      if (!section) {
        // this is an error -- we should be able to get the section now
        console.error(`actions._createSection(${path}): server section created but client section not found`);
        return Promise.resolve();
      }

      // 3. have the section update with the response data
      section.loaded(sectionData);

      // 4. navigate if necessary
      if (navigate) utils.navigateToRoute(section.route, "REPLACE");
    });
}


//////////////////////////////
//  Duplicate some section.  Undoing removes the section.
//////////////////////////////
export function duplicateSection(options = {}) {
  let {
    section = oak.section,                // default to current section
    sectionId = section && section.sectionId,   // default to section's name, createSection will uniquify.
    position = oak.section && oak.section.position + 1, // optional: 1-based numeric position within the section, undefined = place after current section
    navigate = true,  // optional: if true, we'll navigate to the section after creation
    actionName = "Duplicate Section", autoExecute
  } = options;

  if (!section) die(oak, "actions.duplicateSection", [options], "section not found");

  return createSection({
    projectId: section.projectId,
    sectionId,
    title: section.title,
    data: section.getDataToSave(),
    position,
    navigate,
    actionName,
    autoExecute
  });

}

// Export all as a lump
export default Object.assign({}, exports);

//////////////////////////////
//  Actions for dealing with sections
//////////////////////////////
"use strict";

import { die,  } from "oak-roots/util/die";
import { UndoTransaction } from "oak-roots/UndoQueue";

import api from "../api";
import JSXFragment from "../JSXFragment";
import oak from "../oak";

import utils from "./utils";


// Save the section to the server.
// NOTE: this is currently not undoable.
// TODO: this doesn't return a transaction, so can't be used in other undo contexts... ???
export function saveSection() {
  return oak.section.save("FORCE");
}


// Change a section's id.
export function changeSectionId(options = {}) {
  let {
    section = oak.section,    // section to change
    id: newId,                // new id for the section
    actionName = "Rename Section", autoExecute
  } = options

  if (typeof section === "string") section = oak.registry.getSection(...section.split("/"));

  if (!section) die(oak, "actions.changeSectionId", [options], "you must specify options.section");
  if (!newId) die(oak, "actions.changeSectionId", [options], "you must specify options.id");

  const oldId = section.sectionId;

  // Only navigate if we're on the same section
  const oldRoute = (section === oak.section ? oak.getPageRoute(section.projectId, oldId, oak.page.pageId) : undefined);
  const newRoute = (section === oak.section ? oak.getPageRoute(section.projectId, newId, oak.page.pageId) : undefined);

  function undo() { return _changeSectionId(section, oldId, oldRoute) };
  function redo() { return _changeSectionId(section, newId, newRoute) };

  return new UndoTransaction({
    redoActions:[redo],
    undoActions:[undo],
    actionName,
    autoExecute
  });
}

// Internal routine to actually rename and possibly navigate
function _changeSectionId(section, toId, route) {
  const fromId = section.sectionId;
  return api.changeComponentId(section, toId)
    .then( () => {
      // update section
      section.sectionId = toId;
      // update section sectionIndex
      section.project.sectionIndex.changeId(fromId, toId)
console.info("section id changed, navigating to ", route);
      // navigate to route if provided
      if (route) utils.navigateToRoute(route, "REPLACE");
    });
}


// Create a new section.
// Undoing deletes the section.
export function createSection(options) {
  const {
    projectId = oak.section && oak.section.projectId,
    sectionId = oak.section && oak.section.sectionId,
    index,  // index in the section, undefined = place at the end
    title,  // optional title for the section
    jsxe,   // optional JSXE content
    script, // optional script content
    styles, // optional styles content
    actionName = "New Section", autoExecute
  } = options;

  // TODO: verify that section/project exist?
  if (!projectId) die(oak, "actions.createSection", [options], "you must specify options.sectionId");
  if (!sectionId) die(oak, "actions.createSection", [options], "you must specify options.sectionId");



}


// Export all as a lump
export default Object.assign({}, exports);

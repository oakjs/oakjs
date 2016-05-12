//////////////////////////////
//  Actions for dealing with pages
//////////////////////////////
"use strict";

import { die,  } from "oak-roots/util/die";
import { UndoTransaction } from "oak-roots/UndoQueue";

import oak from "../oak";

import utils from "./utils";


// Save the page to the server.
// NOTE: this is currently not undoable.
export function savePage() {
  return oak.page.save("FORCE");
}


export function getPageRoute(projectId, sectionId, pageId) {
  if (pageId !== undefined) return `/project/${projectId}/${sectionId}/${pageId}`;
  if (sectionId !== undefined) return `/project/${projectId}/${sectionId}`;
  if (projectId !== undefined) return `/project/${projectId}`;
  throw new TypeError(`oak.getPageRoute(${projectId}, ${sectionId}, ${pageId}): invalid params`);
}

// Show a particular page
export function showPage({ projectId, sectionId, pageId }) {

}



// Export all as a lump
export default Object.assign({}, exports);

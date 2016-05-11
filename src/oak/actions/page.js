//////////////////////////////
//  Actions for dealing with pages
//////////////////////////////
"use strict";

import { die,  } from "oak-roots/util/die";
import { UndoTransaction } from "oak-roots/UndoQueue";

import oak from "../oak";

import utils from "./utils";

//////////////////////////////
//  Manipulating page
//////////////////////////////

// Save the page to the server.
// NOTE: this is currently not undoable.
export function savePage() {
  return oak.page.save("FORCE");
}



// Export all as a lump
export default Object.assign({}, exports);

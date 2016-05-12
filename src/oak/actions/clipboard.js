//////////////////////////////
//  Actions for dealing with elements
//////////////////////////////

import { die } from "oak-roots/util/die";
import UndoQueue, { UndoTransaction } from "oak-roots/UndoQueue";

import oak from "../oak";
import JSXElement from "../JSXElement";

import actions from "./index";
import utils from "./utils";


// Set to `true` to debug adding/removing elements
const DEBUG = false;

//////////////////////////////
//  Element clipboard
//////////////////////////////

// Copy `elements` into the `oak.clipboard`.
// Default is to copy `oak.selection`.
//
// Optional options:  `elements`, `context`, `autoExecute`, `actionName`
export function copyElements(options) {
  const {
   context, elements = oak.selectedComponents,
    actionName = "Copy", autoExecute
  } = options;

  if (!Array.isArray(elements)) die(oak, actionName, options, "`options.elements` must be an array");

  const oldClipboard = [].concat(oak.clipboard);
  const newClipboard = [].concat(elements);

  function redo() { oak.clipboard = newClipboard }
  function undo() { oak.clipboard = oldClipboard }

  return new UndoTransaction({
    redoActions:[redo],
    undoActions:[undo],
    actionName,
    autoExecute
  });
}


// Remove `elements` from `context` and place in `oak.clipboard`.
// Default is to cut `oak.selection`.
//
// Optional options:  `elements`, `context`, `autoExecute`, `actionName`
export function cutElements(options) {
  const {
   context, elements = oak.selectedComponents,
    actionName = "Cut", autoExecute
  } = options;

  if (!Array.isArray(elements)) die(oak, actionName, options, "`options.elements` must be an array");

  return new UndoTransaction({
    actionName: "Cut",
    transactions: [
      copyElements({ context, elements, actionName, autoExecute: false }),
      actions.removeElements({ context, elements, actionName, autoExecute: false }),
      actions.clearSelection({ autoExecute: false })
    ],
    autoExecute
  });
}


// Paste `elements` from the `oak.clipboard` inside `parent` at `position`.
// Required options:  `parent`, `position`
// Optional options:  `context`, `autoExecute`, `actionName`
export function pasteElements(options) {
  const {
   context, position,
    actionName = "Paste", autoExecute
  } = options;

  // pasting what's in the clipboard
  const elements = oak.clipboard;
  if (!elements || elements.length === 0) die(oak, actionName, options, "Nothing to paste");

  const fragment = utils.getFragmentOrDie(context, actionName);

  // default to the first selected thing (or whoever of it's parents can accept the elements).
  let parent = options.parent || oak.selectedComponents[0];
  if (typeof parent === "string") parent = fragment.getElementOrDie(parent, actionName);

  while (parent && !parent.canDrop(oak.clipboard)) {
    parent = fragment.getParentOrDie(parent, actionName);
  }

  return actions.addElements({
    context,
    parent,
    position,
    elements: oak.clipboard,
    actionName,
    autoSelect: true,
    autoExecute
  });
}



// Export all as a lump
export default Object.assign({}, exports);


//////////////////////////////
//  Drag and drop editor stuff for components
//
//  TODO: scope for `canDrag` and `canDrop` etc???
//
//////////////////////////////

import { proto } from "oak-roots/util/decorators";


// WORKING DRAG/DROP PROPERTIES / METHODS
//   draggable          // false = not draggable (eg: draggable by default)
//   droppable          // true = droppable
//
//   dragType           // string = explicit type
//   dropTypes          // undefined = anything, string or string list = explicit types
//
//   canDrag()          // can this instance be dragged right now?  params? scope?
//   canDrop()          // can the current draggable(s) drop on this instance right now?  params? scope?

// POSSIBLE DRAG / DROP PROPERTIES / METHODS
//   nestable           // false = we can't drop another inside ourselves.
//   getDragPreview()   // return custom html elements for drag preview
//   onDragStart()      // fired when dragging actually starts
//   onDragMove()       // fired on drag move
//   onDragEnd()        // fired when dragging completes (if it started at all)
//   dropMode           // “flow”, “positioned” etc
//   getDropInfo()      // return drop info (eg: position, etc).  params? scope?
//   onDragEnter()      // draggable enter drop target (ignoring nesting)
//   onDragOver()       // moved when within this drop target?
//   onDragLeave()      // draggable exit drop target (ignoring nesting)
//   onDrop()           // dropped inside

// Registry of `{ <packageId> => editorProps }`.
const REGISTRY = {};


// Return editor props associated with some thing.
// You can pass a Component or string which has been `editify`d.
export function getEditorProps(thing) {
  if (thing.editorProps) return thing.editorProps;
  return REGISTRY[thing];
}

// Make a thing editable
export function editify(packageName, props, ...things) {
  things.forEach( thing => {
    const key = (typeof thing === "string" ? thing : thing.name);
    const packageId = (packageName ? `${packageName}.${key}` : key);
//console.info(packageId);

    // create new props object for each and default dragType
    const editorProps = new EditorProps(props);
    if (!editorProps.dragType) editorProps.dragType = packageId;

    // Register under packageId
    REGISTRY[packageId] = editorProps;

    // assign directly for components.
    if (typeof thing === "function") thing.editorProps = editorProps;
  });
}


// Make a map of constructors editable with the same properties.
export function editifyMap(packageName, props, map) {
  Object.keys(map).forEach( key => {
    const component = map[key];
    // ignore things which are not functions (eg `default` if it sneaks in there).
    if (typeof component !== "function") return;

    const packageId = (packageName ? `${packageName}.${key}` : key);
//console.info(packageId);
    // create new props object for each and default dragType
    const editorProps = new EditorProps(props);
    if (!editorProps.dragType) editorProps.dragType = packageId;

    // add under packageId and directly to constructor
    REGISTRY[packageId] = editorProps;
    component.editorProps = editorProps;
  });
}


export default class EditorProps {
  constructor(props) {
    Object.assign(this, props);
    // normalize dropTypes to an array
    if (typeof this.dropTypes === "string") this.dropTypes = this.dropTypes.trim().split(/\s*,\s*/g);
  }

  //////////////////////////////
  //  Draggable stuff
  //////////////////////////////
  @proto
  draggable = true;

  // Can this thing be dragged?
  // TODO: "locked" ?
  canDrag(jsxElement) {
    return this.draggable;
  }


  //////////////////////////////
  //  Dropppable stuff
  //////////////////////////////
  @proto
  droppable = true;   // TODO: ???

  @proto
  nestable = true;   // TODO: ???

  // Can `elements` JSXElements be dropped on us?
  // Subclasses likely want to defer to this to start...
  canDrop(dropTarget, dragElements) {
    if (!this.droppable || !dragElements || !dragElements.length) return false;

    // dont' allow drop of dragElements on themselves or their children
    if (dragElements.some(element => element.contains(dropTarget.oid))) return false;

    // check for nesting
    if (!this.nestable && dragElements.some(element => element.type === dropTarget.dragType)) return false;

    // return true if dragElements's dragTypes are compatible with our dropTypes
    const dropTypes = this.dropTypes;
    if (!dropTypes) return true;
    const dragTypes = dragElements.map( element => element.dragType ).filter(Boolean);
    return dragTypes.every( dragType => dropTypes.includes(dragType) && !dropTypes.includes("-"+dragType) );
  }

  //////////////////////////////
  //  Install the hookup/lookup functions on `EditorProps` class for reflection.
  //////////////////////////////
  static REGISTRY = REGISTRY;
  static getEditorProps = getEditorProps;
  static editify = editify;
  static editifyMap = editifyMap;
}


// Import HTML drag and drop bindings.
// NOTE: we have to do a `require` here because `import`s are hoisted to the top of the file....
require("./EditorProps-html");

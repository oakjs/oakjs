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
//   nestable           // false = we can't drop another inside ourselves.
//
//   dragType           // string = explicit type
//   dropTypes          // undefined = anything, string or string list = explicit types
//
//   canDrag()          // can this instance be dragged right now?  params? scope?
//   canDrop()          // can the current draggable(s) drop on this instance right now?  params? scope?

// POSSIBLE DRAG / DROP PROPERTIES / METHODS
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
}


// Make a thing editable
export function editify(props, thing, dragType) {
  thing.editorProps = new EditorProps(props);
  if (!thing.editorProps.dragType) {
    thing.editorProps.dragType = dragType || thing.name;
  }
}


// Make a bunch of constructors editable with the same properties.
//TODOC
export function editifyMap(map, props, ...keys) {
  if (keys === undefined) keys = Object.keys(map);
  keys.forEach( key => {
    const thing = map[key];
    if (!thing) return console.warn(`editifyFromMap(): key '${key}' not found`);
    editify(props, thing, key);
  });
}

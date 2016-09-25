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

export default class DragProps {
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
  nestable = true;   // TODO: nestable should default to droppable, with ability to override it...

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
  //  Registration / lookup of DragProps
  //////////////////////////////

  // Registry of `DragProps.register()`ed components.
  static REGISTRY = {};

  // Return DragProps for a `register()`ed component or component name.
  static get(thing) {
    if (thing.__dragProps__) return thing.__dragProps__;
    return DragProps.REGISTRY[thing];
  }

  // Register dragProps for one or more `things`.
  // You can pass:
  //    - string component name
  //    - component instance
  //    - map of the above (eg: exports)
  //      - NOTE: when passing a map, watch out for `defaults`...
  static register(packageName, options, ...things) {
    things.forEach( thing => {
      if (!thing) return;

      // If a string, just register under the packageName
      if (typeof thing === "string") {
        const packageId = (packageName ? `${packageName}.${thing}` : thing);
        _registerString(packageId, options);
      }
      // if a function, register as a component
      else if (typeof thing === "function") {
        const packageId = (packageName ? `${packageName}.${thing.name}` : thing.name);
        _registerComponent(packageId, options, thing);
      }
      // Assume it's a map: iterate through keys and _editify as appropriate
      else {
        Object.keys(thing).forEach( key => {
          const item = thing[key];
          // If they register `exports`, the key for the `default` export will be `default`
          //  rather than the component name.  Compenstate.
          // Better is to `export default X` AFTER you `DragProps.register()`.
          if (key === "default") {
            console.warn(`EditorProps.register(${packageName}) with a map: got key 'default', using key '${thing.name}' instead.`);
            key = thing.name;
          }
          const packageId = (packageName ? `${packageName}.${key}` : key);

          if (typeof item === "string") _registerString(packageId, options);
          else if (typeof item === "function") _registerComponent(packageId, options, item);
        });
      }
    });
  }
}


// Internal routines to register strings and/or components, used by `DragProps.register()`.
function _registerString(packageId, props) {
  // create DragProps instance and default dragType
  const dragProps = new DragProps(props);
  if (!dragProps.dragType) dragProps.dragType = packageId;

  // Register under packageId
  DragProps.REGISTRY[packageId] = dragProps;

  return dragProps;
}

function _registerComponent(packageId, props, component) {
  const dragProps = _registerString(packageId, props);
  component.__dragProps__ = dragProps;
  return dragProps;
}

//////////////////////////////
//  Drag and drop editor stuff for components
//
//  TODO: scope for `canDrag` and `canDrop` etc???
//
//////////////////////////////

import { proto } from "oak-roots/util/decorators";


// DRAG PROPERTIES / METHODS
// 	draggable:		    // false = not draggable (eg: draggable by default)
// 	dragType:  		    // string = explicit type
// 	canDrag(),		    // can this instance be dragged right now?  params? scope?
// 	getDragPreview(),	// return custom html elements for drag preview
// 	onDragStart(),		// fired when dragging actually starts
// 	onDragMove(),	    // fired on drag move
// 	onDragEnd(),		  // fired when dragging completes (if it started at all)

// POSSIBLE DROP PROPERTIES / METHODS
// 	droppable		      // true = droppable
// 	dropTypes:		    // undefined = anything, string or string list = explicit types
// 	dropMode:		      // “flow”, “positioned” etc
// 	canDrop(),		    // can the current draggable(s) drop on this instance right now?  params? scope?
// 	getDropInfo(),		// return drop info (eg: position, etc).  params? scope?
// 	onDragEnter(),	  // draggable enter drop target (ignoring nesting)
// 	onDragOver(),		  // moved when within this drop target?
// 	onDragLeave(),	  // draggable exit drop target (ignoring nesting)
// 	onDrop()			    // dropped inside


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
  canDrag() {
    return this.draggable;
  }


  //////////////////////////////
  //  Dropppable stuff
  //////////////////////////////
  @proto
  droppable = true;   // TODO: ???

  // Can `elements` JSXElements be dropped on us?
  // Subclasses likely want to defer to this to start...
  // TODO: scope for parent?
  canDrop(elements) {
    if (!this.droppable || !elements || !elements.length) return false;
    // return true if elements's dragTypes are compatible with our dropTypes
    const dropTypes = this.dropTypes;
    if (!dropTypes) return true;
    const dragTypes = elements.map( element => element.dragType ).filter(Boolean);
    return dragTypes.every( dragType => dropTypes.includes(dragType) && !dropTypes.includes("-"+dragType) );
  }
}


// Make a thing editable
export function editify(props, thing, dragType) {
  thing.editProps = new EditorProps(props);
  if (!thing.editProps.dragType) {
    thing.editProps.dragType = dragType || thing.name;
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

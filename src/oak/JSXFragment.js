//////////////////////////////
// JSXFragment class
//
//  This attempts to strike a balance between structural sharing and encapsulation.
//
//  Possible optimizations:
//    - text / etc nodes are currently not JSXElements -- some logic would get cleaner if they were
//    - JSXElements don't point directly to children (requires "remove" to yield a JSXFragment)
//    - JSXElements hold their code and forget it on clone()
//
//////////////////////////////

import { die, dieIfOutOfRange } from "oak-roots/util/die";

//import babel from "oak-roots/util/babel";
import ids from "oak-roots/util/ids";

import JSXElement from "./JSXElement";
import JSXParser from "./JSXParser";


export default class JSXFragment {

  // Create a new JSXFragment.
  //  - `props` are arbitrary properties
  //  - `root` is a JSXElement
  //  - `oids` is a map of oids contained in `roots`
  constructor({ controller, props, root, oids } = {}) {
    this.controller = controller;
    this.root = root;
    this.props = Object.assign({}, props);
    this.oids = Object.assign({}, oids);
  }

  // Clone this JSXFragment
  // NOTE: we'll clone the `oids`, but all of the elements we point to will be the same.
  clone() {
    return new JSXFragment({
      controller: this.controller,
      props: this.props,
      root: this.root,
      oids: this.oids
    });
  }

  // Parse some JSX `code`, returning a new `JSXFragment`.
  // `options` will be passed to the `new JSXFragment` call.
  static parse(code, options) {
    const fragment = new JSXFragment(options);

    const parser = new JSXParser();
    fragment.root = parser.parse(code, {
      oids: fragment.oids,
      getRandomOid: fragment.getUniqueOid.bind(fragment)
    });

    return fragment;
  }

  //////////////////////////////
  // Element / parent lookup
  //////////////////////////////

  // Return a single element specified by `oid` or by reference to a `JSXElement`.
  getElement(elementOrOid) {
    if (elementOrOid instanceof JSXElement) return elementOrOid;
    return this.oids[elementOrOid];
  }

  // Return a single element specified by `oid` or by reference to a `JSXElement`
  //  or die trying.
  getElementOrDie(elementOrOid, operation, args, message) {
    if (elementOrOid instanceof JSXElement) return elementOrOid;
    const element = this.oids[elementOrOid];
    if (element) return element;
    die(this, operation, args || [elementOrOid], message || ("element "+elementOrOid+" not found"));
  }

  // Given an `element` or an `oid` in this fragment,
  //  return its parent element, or `undefined` if no element or no parent.
  getParent(elementOrOid) {
    const element = this.getElement(elementOrOid);
    if (element && element._parent) return this.getElement(element._parent);
    return undefined;
  }

  // Given an `element` or an `oid` in this fragment,
  //  return its parent element,
  // or throws if expected `element` or `parent` isn't found.
  getParentOrDie(elementOrOid, operation = "getParentOrDie") {
    const element = this.getElementOrDie(elementOrOid, operation);
    const parentOid = element._parent;
    if (!parentOid) return undefined;
    return this.getElementOrDie(parentOid, operation, [ element.oid, parentOid], "parent not found");
  }

  // Given an `element` or an `oid` in this fragment,
  //  return an array of the element's parents with the fragment root LAST.
  // Throws if any of the elements can't be found.
  getParentsOrDie(elementOrOid) {
    const element = this.getElementOrDie(elementOrOid, "getParentsOrDie");
    const parents = [];
    let parent = this.getParentOrDie(element);
    while (parent) {
      parents.push(parent);
      parent = this.getParentOrDie(parent);
    }
    return parents;
  }

  // Given a list of elements or oids, return as a list of elements.
  getElements(elementsOrOids = []) {
    return elementsOrOids.map( elementOrOid => this.getElement(elementOrOid) )
      .filter(Boolean);
  }

  // Return an array of the element children of an element.
  // Returns `undefined` if element not found or element has no children.
  getChildren(elementOrOid) {
    // get children, bailing if not found or no kids
    const element = this.getElement(elementOrOid);
    if (element) return element.children;
    return undefined;
  }

  // Execute callback for each element child of an element.
  // Fails silently if element can't be found.
  forEachChild(elementOrOid, callback) {
    const children = this.getChildren(elementOrOid);
    if (!children) return;
    children.forEach( child => callback(child) );
  }

  // Execute callback for each descendent elements of an element.
  // NOTE: does NOT include the element itself!
  // Fails silently if element can't be found.
  forEachDescendent(elementOrOid, callback) {
    const children = this.getChildren(elementOrOid);
    if (!children) return;
    // do the callback breadth-first across children first
    children.forEach( child => callback(child) );
    // recurse for kids of kids
    children.forEach( child => this.forEachDescendent(child, callback) );
  }


  //////////////////////////////
  // Modify element properties
  //////////////////////////////

  // Change properties of one or more `elements` according to `propDeltas`.
  // Returns the cloned elements which were changed.
  // NOTE: modifies this fragment IN PLACE.
  setProps(propDeltas, elements) {
    return elements.map( element => {
      const clone = this._cloneElementAndParents(element);
      if (clone instanceof JSXElement) {
        clone.props = Object.assign({}, clone.props, propDeltas);
      }
      return clone;
    });
  }

  // Set properties of one or more `elements` to `props` passed in, ignoring original props.
  // Returns the cloned elements which were changed.
  // NOTE: modifies this fragment IN PLACE including our `oids` map.
  resetProps(props, elements) {
    return elements.map( element => {
      const clone = this._cloneElementAndParents(element);
      if (clone instanceof JSXElement) {
        clone.props = Object.assign({}, props);
      }
      return clone;
    });
  }



  //////////////////////////////
  // Add/remove elements
  //////////////////////////////


  // Add a clone of `elements` to `parent` at `position`.
  // Attempts to keep the oids of `elements` and children,
  //  but will generate new oids if oids are already present.
  //
  // Returns an array of the clones actually added.
  //
  // NOTE: modifies this fragment IN PLACE including our `oids` map.
  add(parent, position, elements) {
    if (!elements.length) return [];

    const parentClone = this._cloneElementAndParents(parent);
    if (!parentClone.children) parentClone.children = [];

    if (typeof position !== "number") position = parentClone.children.length;

    const _cloneAndUniquify = (element, parentOid) => {
      const clone = this.cloneElement(element);
      if (clone instanceof JSXElement) {
        clone._parent = parentOid;
        if (clone instanceof JSXElement) {
          // make sure clone has a unique oid within this fragment
          clone.oid = this.getUniqueOid(clone.oid);
          this._addOid(clone);
          // recurse for children
          if (clone.children) {
            clone.children = clone.children.map( child => _cloneAndUniquify(child, clone.oid) );
          }
        }
      }
      return clone;
    };

    return elements.map( (element, index) => {
      const clone = _cloneAndUniquify(element, parentClone.oid);
      parentClone.children.splice(position + index, 0, clone);
      return clone;
    });
  }

  // Remove the element at `position` of `parent`.
  // Returns the element removed.
  // NOTE: modifies this fragment IN PLACE including our `oids` map.
  remove(_parent, position) {
    const parent = this.getElementOrDie(_parent);
    dieIfOutOfRange(this, "remove", parent.children, position);

    const parentClone = this._cloneElementAndParents(parent);

    // pull out the element
    let element = parentClone.children.splice(position, 1)[0];

    // clone and clear parent
    if (element instanceof JSXElement) {
      element = element.clone();
      delete element._parent;
    }

    // recursively remove all `oids` for element and its children
    this._removeOids(element);

    // return the element;
    return element;
  }

  // Remove a single element (specified by `oid` or `element` pointer).
  // Returns the element removed.
  // NOTE: modifies this fragment IN PLACE including our `oids` map.
  removeElement(_element) {
    const element = this.getElementOrDie(_element);
    const parent = this.getParentOrDie(element);

    const index = parent.indexOf(element);
    return this.remove(parent, index);
  }

  // Remove a set of `elements` and their descendents.
  // Returns the elements removed.
  // NOTE: modifies this fragment IN PLACE including our `oids` map.
  removeElements(elements) {
    return elements.map( this.removeElement.bind(this) );
  }

  //////////////////////////////
  //  Cloning / duplicating elements
  //////////////////////////////

  // Return a SHALLOW clone of the element (eg: children are the same objects).
  // NOTE: clone has no side effects on this fragment.
  cloneElement(element) {
if (!element) debugger;
    if (!(element instanceof JSXElement)) return element;
    return element.clone();
  }

  // Return an unique `oid` which is not already contained in our `oids`.
  // If you already have an `oid` which may or may not be used,
  //  pass that and if it IS already not in our `oids`, you'll get it back.
  getUniqueOid(oid) {
    while (!oid || this.oids[oid]) {
      oid = this.getRandomOid();
    }
    return oid;
  }

  // Return a prefix we'll assign to all NEW oids generated by `getRandomOid()`.
  get oidPrefix() {
    return this.props.oidPrefix || "";
  }

  // Return a random `oid` for an element.
  getRandomOid() {
    return this.oidPrefix + JSXFragment.getRandomOid();
  }

  // Base random id routine.
  // The `8` below is a compromise between stupidly long IDs and chance of collisions.
  // Adjust up if collisions are rampant.
  static getRandomOid() {
    return ids.generateRandomId(8);
  }



  //////////////////////////////
  //  Creating a Component constructor for this fragment.
  //////////////////////////////

  // Return a React Component for the current state of this JSXFragment.
  // We do this by combining the `script` and a `render()` function
  //  created by generating source from our `root` `JSXElement`
  //  and using `Babel` to compile that all into a class.
  //
  //  This lets us get arrow functions, etc on platforms that don't support them.
//   createComponent(componentName, SuperConstructor = OakComponent, script) {
//     let Constructor;
//
//     const renderSource = this._getRenderSource();
//     //console.warn(renderSource);
//
//     try {
//       // NOTE: we have to manually stick in a `render()` function here
//       //       because React barfs if we try to set `render()` directly.
//       let classScript = [
//         renderSource,
//         script || "",
//       ].join("\n");
//       Constructor = babel.createClass(classScript, SuperConstructor, componentName);
// //window.Constructor = Constructor;
//       return Constructor;
//     }
//     catch (error) {
//       console.error("Error creating component constructor: ", error);
//       throw error;
//     }
//
//     return Constructor;
//   }

	get renderVars() {
		return this.controller.constructor.renderVars || {};
	}

  _getRenderSource(indent = "", options) {
    // set up `getComponent()` method
    const errorMessage = `${""+this.controller}: Can't find component`;
    const childIndent = indent + "  ";
    const renderVars = this.renderVars;

    return [
      `${indent}render() {`,
      `${childIndent}if (this.props.hidden) return null;`,
      this._getRenderVars(childIndent, options),
      "",
      this._getCreateElementMethod(childIndent, options),
      "",
      `${childIndent}return ${this.root._elementsToSource(childIndent, options)};`,
      `${indent}}`
    ].join("\n");
  }

  _getCreateElementMethod(indent, options) {
  	const output = [
      `${indent}// get a component constructor given a string type`,
      `${indent}function createElement(type, props, ...children) { `
    ];
    if (this.renderVars.controller) {
    	output.push(
	      `${indent}  return controller.createElement(type, props, ...children);`,
    	);
    }
    else {
    	output.push(
	      `${indent}  const component = oak.lookupComponent(type, components, "${errorMessage}");`,
  	    `${indent}  return React.createElement(component, props, ...children);`,
      );
    }
    output.push(
      `${indent}}`
    );
    return output.join("\n");
  }

  // Set up ``renderVars` for the `render` function.
  _getRenderVars(indent = "  ") {
    const renderVars = this.renderVars;
    const output = [];
    output.push(`${indent}// variables for use in expressions below`);
    Object.keys(renderVars).forEach(
      key => output.push(`${indent}var ${key} = ${renderVars[key]};`)
    );
    return output.join("\n");
  }



  //////////////////////////////
  //  Utility -- don't call these yourself!
  //////////////////////////////

  // Clone an `element` or `oid` and all of its parents IN PLACE,
  //  in preparation for modifying the element with impunity.
  // NOTE: modifies this fragment IN PLACE including our `oids` map.
  _cloneElementAndParents(elementOrOid, operation = "_cloneElementAndParents") {
    const element = this.getElementOrDie(elementOrOid, operation);
    const parents = this.getParentsOrDie(element);

    const clone = this.cloneElement(element);
    this._addOid(clone);

    const root = parents.reduce((child, parent) => {
      const index = parent.indexOf(child);
      if (index === -1) die(this, operation, [child, parent], "Child not found in parent");

      const parentClone = this.cloneElement(parent);
      this._addOid(parentClone);

      parentClone.children[index] = child;
      return parentClone;
    }, clone);

    this.root = root;
    return clone;
  }

  // Recursively execute `callback` for `element` and each of its desendants.
  _forEachDescendant(element, callback) {
    callback(element);
    // recurse for JSXElements only
    if (element instanceof JSXElement && element.children) {
      element.children.forEach( child => this._forEachDescendant(child, callback) );
    }
  }

  _addOid(element) {
    if (element instanceof JSXElement) this.oids[element.oid] = element;
  }

  _removeOid(element) {
    if (element instanceof JSXElement) delete this.oids[element.oid];
  }

  // Recursively remove the `oid` of an element and all of its children.
  _removeOids(element) {
    this._forEachDescendant(element, (element) => this._removeOid(element));
  }

  // Given a possibly mixed list of parents and their descendents as oids or elements, throw out children.
  // Eg: after this call, nothing left in the list will be a descendent of anything else.
  _removeDescendents(elements = []) {
    if (elements.length === 0) return [];

    const oids = elements.map( elementOrOid => JSXElement.getOid(elementOrOid) ).filter(Boolean);

    return elements.filter( (element) => {
      return !this.getParentsOrDie(element).some( parent => oids.includes(parent.oid) );
    });
  }

  //////////////////////////////
  //  Debug
  //////////////////////////////

  debug() {
    const report = this.checkOids();
    const reportCount = (report.length ? `${report.length} problems found` : "no problems");
    console.group(`${this} debug report: ${reportCount}`);
    report.forEach( error => console.log(error) );
    console.groupEnd();
  }

  // Check `oids` map and element `_parent` links.
  checkOids() {
    const report = [];

    // Make sure all elements / parents are correctly pointed to by `oids`
    const unfoundOids = Object.assign({}, this.oids);
    this._forEachDescendant(this.root, (element) => {
      if (!(element instanceof JSXElement)) return;

      if (this.oids[element.oid] !== element) {
        report.push(`${element} not found in oids`);
      }
      if (element._parent && !this.oids[element._parent]) {
        report.push(`parent ${element._parent} of ${element} not found in oids`);
      }
      // remove the element from the unfoundOids list.
      delete unfoundOids[element.oid];
    });

    // Notify about unfound oids.
    Object.keys(unfoundOids).forEach( oid => {
      report.push(`${unfoundOids[oid]} found in oids but not in tree`);
    });

    return report;
  }

  toString() {
    return (this.root ? this.root.toString() : "<JSXFragment/>");
  }

  toJSX() {
    return this.root.toJSX();
  }

}

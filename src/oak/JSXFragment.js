//////////////////////////////
// JSXFragment class
//////////////////////////////

import { die, dieIfOutOfRange } from "oak-roots/util/die";

import ids from "oak-roots/util/ids";

import JSXElement from "./JSXElement";
import JSXParser from "./JSXParser";


export default class JSXFragment {

  // Create a new JSXFragment.
  //  - `props` are arbitrary properties
  //  - `root` is a JSXElement
  //  - `oids` is a map of oids contained in `roots`
  constructor(props, root, oids) {
    this.root = root;
    this.props = Object.assign({}, props);
    this.oids = Object.assign({}, oids);
  }

  // Clone this JSXFragment
  // NOTE: we'll clone the `oids`, but all of the elements we point to will be the same.
  clone() {
    return new JSXFragment(this.props, this.root, this.oids);
  }

  // Parse some JSX `code`, returning a new `JSXFragment`.
  static parse(code, props) {
    const fragment = new JSXFragment(props);

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
  get(elementOrOid) {
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
    return undefined;
  }

  // Given an `element` or an `oid` in this fragment,
  //  return its parent element, or `undefined` if no parent.
  // Throws if expected `element` or `parent` isn't found.
  getParentOrDie(elementOrOid) {
    const element = this.getElementOrDie(elementOrOid, "getParentOrDie");
    const parentOid = element._parent;
    if (!parentOid) return undefined;
    return this.getElementOrDie(parentOid, "getParentOrDie", [ element.oid, parentOid], "parent not found");
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


  // Add `elements` WITHOUT CLONING to `parent` at `position`.
  // Returns an array of the elements added.
  // NOTE: if you want to duplicate or clone elements, do it BEFORE calling this method!
  // NOTE: modifies this fragment IN PLACE including our `oids` map.
  add(parent, position, elements) {
    if (!elements.length) return [];

    const parentClone = this._cloneElementAndParents(parent);
    if (!parentClone.children) parentClone.children = [];

    if (typeof position !== "number") position = parentClone.children.length;

    return elements.map( (element, index) => {
      parentClone.children.splice(position + index, 0, element);
      if (element instanceof JSXElement) element._parent = parentClone.oid;
      this._addOids(element);
      return element;
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
    const element = parentClone.children.splice(position, 1);

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

  // Return a clone of a single element and all of its descendants.
  // NOTE: this has no side effects on this fragment.
  deepCloneElement(element) {
    const clone = this.cloneElement(element);
    if (clone instanceof JSXElement && clone.children) {
      clone.children = clone.children.map( child => this.deepCloneElement(child) );
    }
    return clone;
  }

  // Duplicate element and all of its descendants, giving them new `oids`.
  // You can pass a single element or an array and you'll get back the same.
  //
  // Pass the `parentOid` of the parent for the top-level element(s),
  //  descendants will be set up correctly automatically.
  //
  // NOTE: this has no side effects on this fragment.
  duplicate(element, parentOid) {
    const clone = this.cloneElement(element);
    if (!(element instanceof JSXElement)) return clone;

    clone._parent = parentOid;
    if (!clone.props) clone.props = {};
    clone.props.oid = this.getUniqueOid();

    if (clone.children) {
      clone.children = clone.children.map( child => this.duplicate(child, clone.oid) );
    }
    return clone;
  }

  // Return an unique `oid` which is not already contained in our `oids`.
  getUniqueOid() {
    let oid;
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

  static getRandomOid() {
    return ids.generateRandomId();
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

  // Recursively add the `oid` of an element and all of its children.
  _addOids(element) {
    this._forEachDescendant(element, (element) => this._addOid(element));
  }

  _removeOid(element) {
    if (element instanceof JSXElement) delete this.oids[element.oid];
  }

  // Recursively remove the `oid` of an element and all of its children.
  _removeOids(element) {
    this._forEachDescendant(element, (element) => this._removeOid(element));
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

}

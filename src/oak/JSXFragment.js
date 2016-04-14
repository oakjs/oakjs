//////////////////////////////
// JSXFragment class
//////////////////////////////

import { die, dieIfOutOfRange } from "oak-roots/util/die";

import ids from "oak-roots/util/ids";

import JSXElementParser from "./JSXElementParser";


export default class JSXFragment {

  // Create a new JSXFragment.
  //  - `props` are arbitrary properties
  //  - `root` is a JSXElement
  //  - `oids` is a map of oids contained in `roots`
  constructor(props, root, oids) {
    this.props = Object.assign({}, props);
    this.root = root;
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

    const parser = new JSXElementParser();
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
  getElementOrDie(elementOrId, operation, args, message) {
    if (elementOrOid instanceof JSXElement) return elementOrOid;
    const element = this.oids[elementOrOid];
    if (element) return element;
    die(this, operation, args || [elementOrId], message || ("element "+elementOrId+" not found"));
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

  // Change a single `prop` of one or more `elements` to `value`.
  // Returns the cloned elements which were changed.
  // NOTE: modifies this fragment IN PLACE.
  changeProps(prop, value, ...elements) {
    if (!prop) die(this, "changeProps", arguments, "`prop` argument not supplied");
    return this.changeProps( { [prop]: value }, ...elements);
  }

  // Change properties of one or more `elements` according to `propDeltas`.
  // Returns the cloned elements which were changed.
  // NOTE: modifies this fragment IN PLACE.
  changeProps(propDeltas, ...elements) {
    return elements.map( element => {
      const clone = this._cloneElementAndParents(element);
      if (clone instanceof JSXElement) {
        clone.props = Object.assign({}, clone.props, propDeltas);
      }
      return clone;
    });
  }

  // Set properties of one or more `elements` according to `props`.
  // Returns the cloned elements which were changed.
  // NOTE: modifies this fragment IN PLACE including our `oids` map.
  setProps(props, ...elements) {
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

    const parentClone = this._cloneElementsAndParents(parent);
    if (!parentClone.children) parentClone.children = [];

    if (typeof position !== "number") position = parent.length;
    return elements.map( (element, index) => {
      parentClone.children.splice(position + index, 0, element);
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
  // NOTE: modifies this fragment IN PLACE including our `oids` map.
  removeElement(_element) {
    const element = this.getElementOrDie(_element);
    const parent = this.getParentOrDie(element._parent);
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
  clone(element) {
    if (!element instanceof JSXElement) return element;
    return element.clone();
  }

  // Return a clone of a single element and all of its descendants.
  // NOTE: this has no side effects on this fragment.
  deepClone(element) {
    const clone = this.clone(element);
    if (clone instanceof JSXElement && clone.children) {
      clone.children = clone.children.map( child => this.deepClone(child) );
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
    const clone = this.clone(element);
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
    return this.oidPrefix + ids.generateRandomId();
  }


  //////////////////////////////
  //  Utility -- don't call these yourself!
  //////////////////////////////

  // Clone an `element` or `oid` and all of its parents IN PLACE,
  //  in preparation for modifying the element with impunity.
  // NOTE: modifies this fragment IN PLACE including our `oids` map.
  _cloneElementAndParents(elementOrId, operation = "_cloneElementAndParents") {
    const element = this.getElementOrDie(elementOrId, operation);
    const parents = this.getParentsOrDie(element);

    const clone = this.clone(element);
    this._addOid(clone);

    const root = parents.reduce((child, parent) => {
      const index = parent.indexOf(child);
      if (index === -1) die(this, operation, [child, parent], "Child not found in parent");

      const parentClone = this.clone(parent);
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
    if (element instanceof JSXElement) this.oids[element.id] = element;
  }

  // Recursively add the `oid` of an element and all of its children.
  _addOids(element) {
    this._forEachDescendant(element, (element) => this._addOid(element));
  }

  _removeOid(element) {
    if (element instanceof JSXElement) delete this.oids[element.id];
  }

  // Recursively remove the `oid` of an element and all of its children.
  _removeOids(element) {
    this._forEachDescendant(element, (element) => this._removeOid(element));
  }

}

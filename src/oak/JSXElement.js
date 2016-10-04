//////////////////////////////
// JSXElement class
//////////////////////////////
"use strict"

import he from "he";

import DragProps from "oak-roots/DragProps";
import { die, dieIfOutOfRange } from "oak-roots/util/die";
import global from "oak-roots/util/global";
import ids from "oak-roots/util/ids";
import objectUtil from "oak-roots/util/object";

import JSXParser from "./JSXParser";

if (!global.acorn) {
	global.acorn = require("acorn-jsx");
}

export default class JSXElement {
  constructor(props) {
    if (props) Object.assign(this, props);
  }

  // Clone this element, including `newProps`. if defined.
  // Clones the `children` array but does NOT clone the children themselves.
  clone(newProps) {
    const Constructor = this.constructor;
    const props = Object.assign(objectUtil.cloneProperties(this), newProps);
    return new Constructor(props);
  }

  //////////////////////////////
  //  Identification via `oid`
  //////////////////////////////

  get childOids() { return this.children && this.children.map(child => JSXElement.getOid(child) ) }

  // Given a `JSXElement` or `oid` string, return an oid string.
  // Returns `undefined` if none of the above.
  static getOid(thing) {
    if (typeof thing === "string") return thing;
    if (thing.oid) return thing.oid;
    return undefined;
  }

  //////////////////////////////
  //  Children
  //////////////////////////////

  get childCount() {
    return (this.children ? this.children.length : 0);
  }


  indexOf(child) {
    if (!this.children) return -1;
    if (child && child.oid) {
      return this.children.findIndex( next => next.oid === child.oid );
    }
    return this.children.indexOf(child);
  }

  // Return an arry of of our descendants who are `JSXElement`s
  //  (ignoring everything else).
//DEPRECATED
  getDescendentElements(descendents = []) {
    const children = this.children;
    if (children) {
      children.forEach(child => {
        if (!(child instanceof JSXElement)) return;
        descendents.push(child);
        child.getDescendentElements(descendents);
      });
    }
    return descendents;
  }

  // Do we recursively contain some child oid?
  // NOTE: includes this element!
  contains(oid) {
    if (this.oid === oid) return true;
    if (!this.children) return false;
    return this.children.some(child => child instanceof JSXElement && child.contains(oid) );
  }

  //////////////////////////////
  //  Edit settings  (NOTE: this is highly oak specific)
  //////////////////////////////

  // Return the on-screen HTML element for this JSXElement
  get renderedElement() {
    return oak.getDOMElementForOid(this.oid);
  }

  // Return the component constructor class or string type for an html element.
// DEPRECATED:  this is not valid if we don't know our controller / components!!!
  get componentConstructor() {
    return oak.lookupComponent(this.type);
  }

  get dragProps() {
    const props = DragProps.get(this.type) || DragProps.get(this.componentConstructor);
//    if (!props) console.warn(`Can't find dragProps for ${this.type}`);
    return props || new DragProps({ dragType: this.type });
  }

  canDrag() {
    return this.dragProps.canDrag(this);
  }

  canDrop(elements) {
    return this.dragProps.canDrop(this, elements);
  }

  get dragType() {
    return this.dragProps.dragType;
  }

  get dropTypes() {
    return this.dragProps.dropTypes;
  }

  //////////////////////////////
  //  Render method
  //////////////////////////////

  // Output an expression which will render this element and its children.
  _elementsToSource(indent = "", options) {
//    const type = this.renderType || this.type;
    const type = this.type;

    const isEditable = options && options.editable;
    const attrExpression = this._propsToSource(indent, options, this.props);

    // output on one line if no children
    let element;
    if (!this.children || this.children.length === 0) {
      element = `createElement("${type}", ${attrExpression})`;
    }
    else {
      const childIndent = indent + "  ";
      const childExpressions =
        this.children.map(child => {
          if (child == null) return;
          if (typeof child === "string") return JSON.stringify(child);
          if (typeof child === "number") return child;
          if (child instanceof JSXElement) return child._elementsToSource(childIndent, options);
          if (child.code) return child.code;
        })
        .join(",\n" + childIndent);

      element = "createElement(\n"
        + childIndent + `"${type}"` + ",\n"
        + childIndent + attrExpression + ",\n"
        + childIndent + childExpressions + "\n"
        + indent + ")";
    }

    // <Referent> if editable
    if (this.oid && isEditable) {
      return `createElement("Oak.Referent", { oid: "${this.oid}", ref: "${this.oid}" }, ${element} )`;
    }
    return element;
  }

  // Convert our props for use in our render method.
  _propsToSource(indent, options, props = this.props) {
    if (!props) return null;

    let keys = Object.keys(props);
    if (keys.length === 0) return null;

    // split into groups:  normal props, ...expressions, etc
    const groups = this._splitPropKeys(keys);
    const propSets = groups.map(group => {
      // if we got just a string, it's an object spread expression
      if (typeof group === "string") {
        return this._propValueToSource("...", props[group], indent);
      }

      const attrExpressions = [];
      group.forEach(key => {
        let value = this._propValueToSource(key, props[key], indent);
        if (value !== undefined) attrExpressions.push(`"${key}": ${value}`);
      });
      return "{" + attrExpressions.join(", ") + "}"
    });

    if (propSets.length === 0) {
      return "undefined";
    }

    if (propSets.length === 1) {
      return propSets[0];
    }

    return "Object.assign(" + propSets.join(", ") + ")";
  }

  // Given a set of prop keys, split into an array of arrays separating `...` entries from normal ones
  _splitPropKeys(keys) {
    const groups = [];
    keys.forEach(key => {
      // if we got a spread
      if (key.startsWith("...")) {
        // add the ... key directly (as a string)
        groups.push(key);
      }
      else {
        // add a normal key to an array
        if (!Array.isArray(groups[groups.length-1])) groups.push([]);
        groups[groups.length-1].push(key);
      }
    });
    // if the first item is a spread and there's more than one group, add an empty group at the beginning
    if (groups.length > 1 && typeof groups[0] === "string") groups.splice(0, 0, []);

    return groups;
  }

  _propValueToSource(key, value, indent, options) {
    if (value === undefined) return undefined;
    if (value instanceof acorn.Node) {
      return value._code;
    }
    if (value instanceof JSXElement) {
      return value._elementsToSource(indent, options);
    }
    return JSON.stringify(value);
  }


  //////////////////////////////
  //  Output as a JSX string
  //////////////////////////////

  // Render this element as a string, close to the code we parsed it from.
  // NOTE: this will normalize the JSX to a canonical format, this is desired.
  toJSX(indent = "", dontNest) {
    const props = this._propsToJSX(indent);
    const tagPrefix = indent + "<" + this.type + (props ? " "+props : "");

    if (this.selfClosing) {
      return tagPrefix + "/>";
    }

    let children;
    if (dontNest) {
      children = this._childrenToJSX("", dontNest);
    }
    else {
      children = this._childrenToJSX(indent+"  ");
      if (children) children += "\n" + indent;
    }
    return tagPrefix + ">" + ( children || "" ) + "</" + this.type + ">";
  }

  // Convert our props to a JSX string.
  _propsToJSX(indent, props = this.props) {
    if (!props) return "";
    const results = [];
    for (let key in props) {
      let value = props[key];
      // skip undefined (but not null ???)
      if (value === undefined) continue;

      // spread expression
      if (key.startsWith("...")) {
        if (value instanceof acorn.Node) value = value._code;
        results.push(`{...${value}}`);
      }
      // strings render as string
      else if (typeof value === "string") {
        results.push(`${key}="${value}"`);
      }
      // `true` renders as just the prop name
      else if (value === true) {
        results.push(key)
      }
      // For acorn nodes, we've squirreled away the exact `_code` during parse
      else if (value instanceof acorn.Node) {
        results.push(`${key}={${value._code}}`);
      }
      else if (value instanceof JSXElement) {
        results.push(`${key}={${value.toJSX("", "DONT_NEST")}}`);
      }
      // Otherwise wrap the value in curly braces and stringify it
      // This is non-optimal but will work for now.
      else {
        results.push(`${key}={${JSON.stringify(value)}}`);
      }
    }
    return results.join(" ");
  }

  // Convert our children to a JSX string.
  // NOTE: if you have special stuff (eg: <script> etc) to output, override this.
  _childrenToJSX(indent, dontNest) {
    const children = this.children;
    if (!children || children.length === 0) return "";

    const childExpressions = children.map(child => {
      // use "he" library to encode entities in the string
      if (typeof child === "string") {
        return indent + he.encode(child, { useNamedReferences: true, decimal: true });
      }
      return child.toJSX(indent);
    })

    if (dontNest) return childExpressions.join("");
    return "\n" + childExpressions.join("\n")
  }

  //////////////////////////////
  //  Debug
  //////////////////////////////

  // Return this element and children as a debug string
  debug(indent = "") {
    const tagPrefix = indent + "<" + this.type + (this.oid ? " "+this.oid : "");
    if (this.selfClosing || !this.children || !this.children.length) {
      return tagPrefix + "/>";
    }

    const childIndent = indent + "  ";
    const children = this.children.map( child => {
      if (child instanceof JSXElement) return child.debug(childIndent);
      return childIndent + "...";
    });
    return tagPrefix + ">\n" + children.join("\n") + "\n" + indent + "</" + this.type + ">";
  }


  toString() {
    let string = `<${this.type}`;
    if (this.oid) string += ` ${this.oid}`;
    return string + "/>";
  }

}



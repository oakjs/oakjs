//////////////////////////////
// JSXElement class
//////////////////////////////
"use strict"

import AcornParser from "oak-roots/AcornParser";
import Mutable from "oak-roots/Mutable";

import { die, dieIfOutOfRange } from "oak-roots/util/die";
import ids from "oak-roots/util/ids";
import objectUtil from "oak-roots/util/object";

import api from "./api";

export default class JSXElement {
  constructor(props) {
    if (props) Object.assign(this, props);
  }

  // Clone this element, including making clones of `props` and `_children` if defined.
  clone(newProps) {
    const Constructor = this.constructor;
    const props = Object.assign(objectUtil.cloneProperties(this), newProps);
    return new Constructor(props);
  }

  //////////////////////////////
  //  Identification via `oid`
  //////////////////////////////

  // Return a random `oid` for an element.
  static getRandomOid() {
    return ids.generateRandomId();
  }

  // Return an unique `oid` which is not already contained in `oidMap`.
  static getUniqueOid(oidMap) {
    let oid;
    while (!oid || oidMap[oid]) {
      oid = this.getRandomOid();
    }
    return oid;
  }

  get oid() { return this.props && this.props.oid }

  getReference() { return new OidRef(this.oid) }

  // Return an item specified by oid.
  // NOTE: this will generally be overridden on each instance during parse....
  getElement(oid) {
    return undefined;
  }

  getChildPosition(child) {
    if (!this._children) return -1;
    if (child && child.oid) {
      return this._children.findIndex( next => next.oid === child.oid );
    }
    return this._children.indexOf(child);
  }

  get children() {
    if (!this._children) return undefined;
    return this._children.map( child => {
      // look up any OidRefs
      if (child instanceof OidRef) {
        const item = this.getElement(child.oid);
        if (!item) console.info("missing child: ",child.oid, " in ", this);
        return item;
      }
      return child;
    });
  }

  get childCount() {
    return (this.children ? this.children.length : 0);
  }

  // Return an arry of of our descendants who are `JSXElement`s
  //  (looking up `OidRef`s and ignoring everything else).
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

  get parent() {
    return this.getElement(this._parent);
  }


  //////////////////////////////
  //  Render method
  //////////////////////////////

  // Your subclass should override to add variables that you want to expose to the render() method.
  static renderVars = {
    props: "this.props",
    state: "this.state",
    context: "this.context"
  };

  // Return a function to draw this element and its children.
  // ASSUMES: that the end class this will be added to has a `createElement()` method
  //  with the same signature as `React.createElement()`, but that is aware of the
  //  `components` which are in scope.
  getRenderMethod(indent) {
    const source = this._getRenderMethodSource(indent);
    return new Function(source);
  }

  _getRenderMethodSource(indent = "  ") {
    const output = [];
    const options = {}

    output.push("console.log('Rendering: ',this);");
//    output.push("console.dir(this.context);");
//    output.push("console.groupEnd();");

    // add ``renderVars` to the function
    const renderVars = this.constructor.renderVars;
    Object.keys(renderVars).forEach(
      key => output.push(`${indent}var ${key} = ${renderVars[key]};`)
    );

    // figure out the source for the elements
    const renderExpression = this._elementsToSource(options, indent);

    // add return + renders at the end
    output.push(`${indent}return ${renderExpression}`);

    return output.join("\n");
  }

  // Output an expression which will render this element and its children.
  _elementsToSource(options = {}, indent = "") {
    const type = this.renderType || this.type;
    const typeExpression = JSON.stringify(type);
    const attrExpression = this._propsToSource(options, indent);

    // output on one line if no children
    if (!this.children || this.children.length === 0) {
      return "this.createElement(" + typeExpression + ", "+ attrExpression + ")";
    }

    const childIndent = indent + "  ";
    const childExpressions =
      this.children.map(child => {
        if (typeof child === "string") return JSON.stringify(child);
        return child._elementsToSource(options, childIndent);
      })
      .join(",\n" + childIndent);

    return "this.createElement(\n"
      + childIndent + typeExpression + ",\n"
      + childIndent + attrExpression + ",\n"
      + childIndent + childExpressions + "\n"
      + indent + ")";
  }

  // Convert our props for use in our render method.
  _propsToSource(options, indent, props = this.props) {
    if (!props) return null;

    let keys = Object.keys(props);
    const groups = this._splitPropKeys(keys);

    const propSets = groups.map(group => {
      // if we got just a string, it's an object spread expression
      if (typeof group === "string") {
        return this._propValueToSource("...", props[group], options, indent);
      }

      const attrExpressions = [];
      group.forEach(key => {
        let value = this._propValueToSource(key, props[key], options, indent);
        if (key === "oid") key = "data-oid";
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

  _propValueToSource(key, value, options, indent) {
    if (value === undefined) return undefined;
    if (value instanceof acorn.Node) {
      return value._code;
    }
    if (value instanceof JSXElement) {
      return value._elementsToSource(options, indent);
    }
    return JSON.stringify(value);
  }


  //////////////////////////////
  //  Output as a string
  //////////////////////////////

  // Render this element as a string, close to the code we parsed it from.
  // NOTE: this will normalize the JSX to a canonical format, this is desired.
	toString(indent = "", dontNest) {
    const props = this._propsToString(indent);
    const tagPrefix = indent + "<" + this.type + (props ? " "+props : "");
    if (this.selfClosing) {
      return tagPrefix + "/>";
    }

    let children;
    if (dontNest) {
      children = this._childrenToString("", dontNest);
    }
    else {
      children = this._childrenToString(indent+"  ");
      if (children) children += "\n" + indent;
    }
    return tagPrefix + ">" + ( children || "" ) + "</" + this.type + ">";
	}

  // Convert our props to a JSX string.
  _propsToString(indent, props = this.props) {
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
        results.push(`${key}={${value.toString("", "DONT_NEST")}}`);
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
  _childrenToString(indent, dontNest) {
    const children = this.children;
    if (!children || children.length === 0) return "";

    const childExpressions = children.map(child => {
      if (typeof child === "string") return indent + child;
      return child.toString(indent);
    })

    if (dontNest) return childExpressions.join("");
    return "\n" + childExpressions.join("\n")
  }


  //////////////////////////////
  // Parsing Registry
  // Add classses which you want to have ALWAYS instantiate as a certain type of JSXElement
  //  as:  `JSXElement.registerType("YourTypeName", YourSubclass);`
  //////////////////////////////

  static TYPE_REGISTRY = {};
  static registerType(type, constructor) {
    JSXElement.TYPE_REGISTRY[type] = constructor;
  }

  //////////////////////////////
  // Parsing
  //////////////////////////////

  // Parse a `.jsxe` file's code.
  static parse(code, options = {}) {
    if (!options.oids) options.oids = {};

    const parser = new JSXElementParser();
    return parser.parse(code, options);
  }

  // Load a `.jsxe` file from the server and parse it.
  // Returns a `Promise` which resolves with the root element
  // or rejects with an error message.
  static load(path) {
    return api.getText(path)
      .then(code => {
        return this.parse(code);
      });
  }
}



//////////////////////////////
// Specialized JSXElement Parser
//////////////////////////////

export class JSXElementParser extends AcornParser {
  parse(code, options = {}) {
    const root = super.parse(code, options);
    if (options.itemProps) Object.assign(root, options.itemProps);
    return root;
  }

  getElementConstructor(type) {
    return JSXElement.TYPE_REGISTRY[type] || JSXElement;
  }

  parseElement(astElement, code, options) {
    const element = super.parseElement(astElement, code, options);
    if (element instanceof JSXElement) {
      // add any itemProps to the element
      Object.assign(element, options.itemProps);
    }
    return element;
  }

  // Add a unique-ish `oid` property to all nodes as we parse node props.
  // NOTE: this will then be saved with the node...
  parseProps(element, astElement, code, options) {
    const props = super.parseProps(element, astElement, code, options) || {};

    // make sure we've got an oid that's unique within options.oids
    while (!props.oid || (props.oid in options.oids)) {
      props.oid = JSXElement.getRandomOid();
    }
    // point to the element by oid for later
    options.oids[props.oid] = element;

    return props;
  }

  // Assign children to _children since we do the child lookup thing
  parseChildren(parent, astChildren, code, options) {
    let children = this._parseChildren(parent, astChildren, code, options);
    if (!children || children.length === 0) return;
    parent._children = children;
  }

  parseChild(parent, astElement, code, options) {
    const child = super.parseChild(parent, astElement, code, options);
    if (child instanceof JSXElement) {
      // have children point back to their parent
      if (parent.oid) child._parent = parent.oid;
      // if we have an oid, we'll pull this child from the `oids` map rather than embedding it
      if (child.oid) {
        return new OidRef(child.oid, options.itemProps);
      }
    }
    return child;
  }

}


//////////////////////////////
//  OidRef class for encapsulating references to other elements
//////////////////////////////

export class OidRef {
  constructor(oid) {
    if (typeof oid !== "string" || !oid) die(app, "new OidRef", oid, "Invalid oid!");
    // define the oid property non-changeable
    Object.defineProperty(this, "oid", { value: oid, enumerable: true });
  }
}

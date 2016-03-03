//////////////////////////////
// JSXElement class
//////////////////////////////

import astParser from "oak-roots/util/astParser";
import ids from "oak-roots/util/ids";
import Mutable from "oak-roots/Mutable";

import api from "./api";

class JSXElement extends Mutable {

  get oid() { return this.attributes && this.attributes.oid }

  //////////////////////////////
  //  Render method
  //////////////////////////////

  // Your subclass should override to add variables that you want to expose to the render() method.
  static renderVars = {
    props: "this.props",
    state: "this.state",
    context: "this.context"
  };

  get oid() { return this.attributes && this.attributes.oid }

  // Return a function to draw this element and its children.
  // ASSUMES: that the end class this will be added to has a `createElement()` method
  //  with the same signature as `React.createElement()`, but that is aware of the
  //  `components` which are in scope.
  getRenderMethod(indent) {
    if (!this.cache.renderMethod) {
      const source = this._getRenderMethodSource(indent);
      this.cache.renderMethod = new Function(source);
    }
    return this.cache.renderMethod;
  }

  _getRenderMethodSource(indent = "  ") {
    const output = [];
    const options = {
      oids: (this.cache.oids = {}),
    }

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
    const attrExpression = this._attributesToSource(options, indent);

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

  // Convert our attributes for use in our render method.
  _attributesToSource(options, indent, attributes = this.attributes) {
    if (!attributes && !options.oids) return null;

    let keys = attributes ? Object.keys(attributes) : [];
    if (options.oids && this.oid) keys.push("data-oid");
    const groups = this._splitAttributeKeys(keys);

    const attributeSets = groups.map(group => {
      // if we got just a string, it's an object spread expression
      if (typeof group === "string") {
        return this._attributeValueToSource("...", attributes[group], options, indent);
      }

      const attrExpressions = [];
      group.forEach(key => {
        let value;
        if (key === "data-oid") {
          const oid = this.oid;
          value = `"${oid}"`;
          options.oids[oid] = this;
        }
        else {
          value = this._attributeValueToSource(key, attributes[key], options, indent);
        }
        if (value !== undefined) attrExpressions.push(`"${key}": ${value}`);
      });
      return "{" + attrExpressions.join(", ") + "}"
    });

    if (attributeSets.length === 1) {
      return attributeSets[0];
    }
    return "Object.assign(" + attributeSets.join(", ") + ")";
  }

  // Given a set of attribute keys, split into an array of arrays separating `...` entries from normal ones
  _splitAttributeKeys(keys) {
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

  _attributeValueToSource(key, value, options, indent) {
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
	toString(indent = "") {
    const attributes = this._attributesToString(indent);
    const tagPrefix = indent + "<" + this.type + (attributes ? " "+attributes : "");
    if (this.selfClosing) {
      return tagPrefix + "/>";
    }
    const children = this._childrenToString(indent+"  ");
    return tagPrefix + ">" + (children ? children + "\n" + indent : "") + "</" + this.type + ">";
	}

  // Convert our attributes to a JSX string.
  _attributesToString(indent, attributes = this.attributes) {
    if (!attributes) return "";
    const results = [];
    for (let key in attributes) {
      let value = attributes[key];
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
      // `true` renders as just the attribute name
      else if (value === true) {
        results.push(key)
      }
      // For acorn nodes, we've squirreled away the exact `_code` during parse
      else if (value instanceof acorn.Node) {
        results.push(`${key}={${value._code}}`);
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
  _childrenToString(indent) {
    const children = this.children;
    if (!children || children.length === 0) return "";

    const childExpressions = children.map(child => {
      if (typeof child === "string") return indent + child;
      return child.toString(indent);
    })

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
  static getElementConstructor(type) {
    return JSXElement.TYPE_REGISTRY[type] || JSXElement;
  }

  // Add a unique-ish `oid` property to all nodes as we parse node attributes.
  // NOTE: this will then be saved with the node...
  static parseAttributes(element, astElement, code, options) {
    const attributes = astParser.parseAttributes(element, astElement, code, options) || {};
    if (!attributes.oid) attributes.oid = ids.generateRandomId();
    return attributes;
  }

  static parseChildren(parent, astChildren, code, options) {
    const children = astParser.parseChildren(parent, astChildren, code, options);
    return children;
  }

  //////////////////////////////
  // Parsing
  //////////////////////////////

  // Parse a `.jsxe` file's code.
  static parse(code) {
    const options = {
      oids: {},
      getElementConstructor: JSXElement.getElementConstructor,
      parseAttributes: JSXElement.parseAttributes,
      parseChildren: JSXElement.parseChildren
    }
    return astParser.parse(code, options);
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

class OidRef {
  constructor(oid) {
    this.oid = oid;
  }
}

export default JSXElement;

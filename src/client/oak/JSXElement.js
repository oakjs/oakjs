//////////////////////////////
// JSXElement class
//////////////////////////////

import astParser from "oak-roots/util/astParser";
import ids from "oak-roots/util/ids";
import Mutable from "oak-roots/Mutable";

import oak from "./oak";
import api from "./api";

class JSXElement extends Mutable {

  //////////////////////////////
  //  Properties
  //////////////////////////////

  // Generate and remember a unique id for this element on demand.
  // NOTE: this id will be copied into clones, but not saved.
  // This is NOT considered a mutation (???)
  get oakId() {
    if (this.hasOwnProperty("__oakId")) return this.__oakId;
    return (this.__oakId = ids.generateRandomId())
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
    if (!this.cache.renderMethod) {
      const source = this._getRenderMethodSource(indent);
      this.cache.renderMethod = new Function(source);
    }
    return this.cache.renderMethod;
  }

  _getRenderMethodSource(indent = "  ") {
    const output = [];
    const options = {
      oakIds: (this.cache.oakIds = {}),
    }

    output.push("console.group('Rendering: ',this);");
    output.push("console.dir(this);");
    output.push("console.dir(this.context);");
    output.push("console.groupEnd();");

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
  _elementsToSource(options, indent = "") {
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
    const attrExpressions = [];
    if (attributes) {
      Object.keys(this.attributes).forEach( key => {
        const value = this._attributeValueToSource(key, this.attributes[key]);
        if (value !== undefined) attrExpressions.push(`"${key}": ${value}`);
      });
    }
    if (options && options.oakIds) {
      const oakId = this.oakId;
      attrExpressions.push(`"data-oakId": "${oakId}"`);
      options.oakIds[oakId] = this;
    }
    if (attrExpressions.length) return "{" + attrExpressions.join(", ") + "}";
    return "null";
  }

  _attributeValueToSource(key, value) {
    if (value === undefined) return undefined;
    if (value instanceof acorn.Node) {
      return value._code;
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
  _attributesToString(indent) {
    const attributes = this.attributes;
    if (!attributes) return "";
    const results = [];
    for (let key in attributes) {
      const value = attributes[key];
      // skip undefined (but not null ???)
      if (value === undefined) continue;

      // strings render as string
      if (typeof value === "string") {
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

  //////////////////////////////
  // Parsing
  //////////////////////////////

  // Parse a `.jsxe` file's code.
  static parse(code) {
    const options = {
      getElementConstructor: JSXElement.getElementConstructor
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

  //////////////////////////////
  // Subclass-specific parsing
  //
  // Add `{ tagName: specialParsingHandlerFn(parent, astNode, code, options)`
  //  to parse DIRECT children with tagName specially.
  //
  // See `astParser.parseChild()`.
  //
  //////////////////////////////

  static specialChildParsers = {};
}

export default JSXElement;

//////////////////////////////
// JSXElement class
//////////////////////////////

class JSXElement {
	constructor(props) {
		if (props) Object.assign(this, props);
		// add a new `cache` object -- everything in this will be blown away when we are clone()d.
		this.cache = {};
	}

  // Return a clone of this element, sharing AST and literal bits.
  clone() {
    return cloneElement(this);
  }

  get oakId() {
    if (this.__oakId) return this.__oakId;
    if (this === this.constructor.prototype) return undefined;
    return (this.__oakId = generateRandomId())
  }

  // Return a function to draw this element and its children.
  // `context` is a map whose properties will be available to any expressions in the JSX.
  // `components` is a map of component constructors.
  toSource(scope) {
    if (this.cache._toSource) return this.cache._toSource;

    const options = {
      scope,
      indent: "  ",
      componentsUsed: (this.cache.componentsUsed = {}),
      oakIds: (this.cache.oakIds = {}),
    }

    return (this.cache._toSource = toSource(this, options));
  }

  // Render this element as a string, close to the code we parsed it from.
  // NOTE: this will normalize the JSX to a canonical format, this is desired.
	toString(indent="") {
	  return elementToString(this, indent);
	}
}



export const ALPHA_NUMERIC = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
export function generateRandomId(length = 6, radix = ALPHA_NUMERIC.length) {
  const letters = [];
  for (let i = 0; i < length; i++) {
    letters[i] = ALPHA_NUMERIC[Math.floor(Math.random() * radix)];
  }
  return letters.join('');
}


//////////////////////////////
// Clone element
//////////////////////////////

export function toSource(element, options = {}) {
  const indent = options.indent || "";
  const output = [];
  if (options.scope) {
    Object.keys(options.scope).forEach(key => output.push(`${indent}var ${key} = scope.${key};`));
    output.push("");
  }

  // figure out the soure for the elements
  const elementSource = elementToSource(element, options);

  // add variables to bring all non-html components into scope
  // NOTE: assumes function is called with a `components` parameter
  if (options.componentsUsed) {
    Object.keys(options.componentsUsed).forEach( componentName => output.push(`${indent}var ${componentName} = components.${componentName};`));
  }

  output.push(`${indent}return ${elementSource}`);

  return new Function("scope, components", output.join("\n"));
}

export function elementToSource(element, options = {}) {
  if (typeof element === "string") return JSON.stringify(element);

  const indent = options.indent || "";

  const type = element.type;
  let typeExpression;
  if (type === type.toLowerCase()) {
    typeExpression = `"${type}"`;
  }
  else {
    if (options.componentsUsed) options.componentsUsed[type] = true;
    typeExpression = type;
  }
  const attrExpression = elementAttributesToSource(element, options);

  // output on one line if no children
  if (!element.children) {
    return "React.createElement(" + typeExpression + ", "+ attrExpression + ")";
  }

  const childOptions = Object.assign({}, options)
  childOptions.indent = indent + "  ";

  const childExpressions =
    element.children.map(child => elementToSource(child, childOptions))
    .join(",\n" + childOptions.indent);

  return "React.createElement(\n"
    + childOptions.indent + typeExpression + ",\n"
    + childOptions.indent + attrExpression + ",\n"
    + childOptions.indent + childExpressions + "\n"
    + indent + ")";
}

export function elementAttributesToSource(element, options) {
  const attributes = element.attributes;
  if (attributes || options.addOakId) {
    const attrExpressions = [];
    Object.keys(attributes).forEach( key => {
      const value = attributeValueToSource(attributes[key]);
      if (value !== undefined) attrExpressions.push(`"${key}": ${value}`);
    });
    if (options.oakIds) {
      const oakId = element.oakId;
      attrExpressions.push(`"data-oakId": "${oakId}"`);
      options.oakIds[oakId] = element;
    }
    if (attrExpressions.length) return "{" + attrExpressions.join(", ") + "}";
  }
  return "null";
}

export function attributeValueToSource(value) {
  if (value === undefined) return undefined;
  if (value instanceof acorn.Node) {
    return value._code;
  }
  return JSON.stringify(value);
}

//////////////////////////////
// Clone element
//////////////////////////////

export function cloneElement(element) {
  const clone = new JSXElement(element);
  if (clone.attributes) clone.attributes = Object.assign({}, clone.attributes);
  if (clone.children) clone.children = clone.children.map( child => {
    if (typeof child === "string") return child;
    const childClone = cloneElement(child);
    childClone.parent = clone;
    return childClone;
  });
  return clone;
}


//////////////////////////////
// JSXElement to string
//////////////////////////////

export function elementToString(element, indent="") {
  const attributes = attributesToString(element.attributes, indent);
  const tagPrefix = indent + "<" + element.type + (attributes ? " "+attributes : "");
  if (element.selfClosing) {
    return tagPrefix + "/>";
  }
  const children = childrenToString(element.children, indent+"  ");
  return tagPrefix + ">" + (children ? children + "\n" + indent : "") + "</" + element.type + ">";
}

export function attributesToString(attributes, indent) {
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

export function childrenToString(children, indent) {
  if (!children || children.length === 0) return "";
  return "\n" + children.map(child => {
    if (typeof child === "string") return indent + child;
    return elementToString(child, indent);
  }).join("\n");
}


//////////////////////////////
// Parsing
//////////////////////////////
export const WHITESPACE = /^[ \t\n\r]*$/;

export function parse(code) {
  const ast = acorn.parse(code);
	return parseElement(ast, code);
}

export function parseElement(astElement, code) {
  const type = astElement.type;
  if (type === "Program") return parseElement(astElement.body[0], code);
  if (type === "ExpressionStatement") return parseElement(astElement.expression, code);
  if (type !== "JSXElement") {
    throw new TypeError(`JSXElement.parseElement({type:'${type}'}): we can only parse {type:'JSXElement'}.`)
  }
  const element = new JSXElement();

  element.type = parseIdentifier(astElement.openingElement.name, code);
  element.selfClosing = astElement.openingElement.selfClosing;
  element.attributes = parseAttributes(astElement.openingElement.attributes, code);
  element.children = parseChildren(element, astElement.children, code);

  return element;
}

// TOOD: match the React algorithm for this:
//  https://github.com/facebook/react/pull/480
function isNonWhitespaceChild(child, index, children) {
  return !WHITESPACE.test(child);
}

export function parseChildren(parent, astChildren, code) {
  if (!astChildren) return undefined;

  // eliminate whitespace between elements
  const children = astChildren.map(child => parseChild(parent, child, code))
                    .filter(isNonWhitespaceChild);

  return (children.length !== 0 ? children : undefined);
}

export function parseChild(parent, astChild, code) {
  const type = astChild.type;
  if (type === "Literal") {
    const value = astChild.value;
    return (typeof value === "string" ? value.trim() : value);
  }
  else if (type === "JSXElement") {
    const child = parseElement(astChild, code);
    if (child) child.parent = parent;
    return child;
  }
  throw new TypeError(`JSXElement.parseChild({type:'${type}'}): we can only parse {type:'Literal' or 'JSXElement'}.`)
}

export function parseAttributes(astAttributes, code) {
  const attributes = {};
  astAttributes.forEach(astAttribute => {
    if (astAttribute.type !== "JSXAttribute") {
      throw new TypeError(`JSXElement.parseAttribute({type:'${astAttribute.type}'}): we can only parse {type:'JSXAttribute'}.`)
    }
    const name = parseAttributeName(astAttribute.name, code);
    const value = parseAttributeValue(astAttribute.value, code);
    attributes[name] = value;
  });
  return attributes;
}

export function parseAttributeName(astName, code) {
  return parseIdentifier(astName, code);
}

export function parseAttributeValue(astValue, code) {
  if (astValue == null) return null;
  const type = astValue.type;
  if (type === "Literal") return astValue.value;
  if (type === "JSXExpressionContainer") return parseAttributeValue(astValue.expression, code);
  // pull out the code and add it to the astValue node
  astValue._code = code.substring(astValue.start, astValue.end);
  return astValue;
}

export function parseIdentifier(ast, code) {
  const type = (ast && ast.type);
  if (type === "JSXIdentifier") return ast.name;
  throw new TypeError(`JSXElement.parseIdentifier({type:'${type}'}): we can only parse {type:'JSXIdentifier'}.`)
}


// Add all of the parse/etc methods statically to JSXElement
Object.keys(exports).forEach(key => JSXElement[key] = exports[key]);

export default JSXElement;
window.JSXElement = JSXElement;

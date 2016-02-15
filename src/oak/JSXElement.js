//////////////////////////////
// JSXElement class
//////////////////////////////

class JSXElement {
	constructor(props) {
		if (props) Object.assign(this, props);
	}

	toString(indent="") {
	  return elementToString(this);
	}

	static parse(code) {
	  const ast = acorn.parse(code);
	  return parseElement(ast, code);
	}
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
    // TODO: parse acorn.Nodes into values
    else if (value instanceof acorn.Node) {
      results.push(`${key}={${value._code}}`);
    }
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
  element.children = parseChildren(astElement.children, code);

  return element;
}

// TOOD: match the React algorithm for this:
//  https://github.com/facebook/react/pull/480
function isNonWhitespaceChild(child, index, children) {
  if (!WHITESPACE.test(child)) return true;
  return false;
}

export function parseChildren(astChildren, code) {
  if (!astChildren) return undefined;

  // eliminate whitespace between elements
  const children = astChildren.map(child => parseChild(child, code))
                    .filter(isNonWhitespaceChild);

  return (children.length !== 0 ? children : undefined);
}

export function parseChild(astChild, code) {
  const type = astChild.type;
  if (type === "Literal") {
    const value = astChild.value;
    return (typeof value === "string" ? value.trim() : value);
  }
  else if (type === "JSXElement") {
    return parseElement(astChild, code);
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


Object.keys(exports).forEach(key => JSXElement[key] = exports[key]);

export default JSXElement;

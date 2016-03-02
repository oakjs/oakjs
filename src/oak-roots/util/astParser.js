//////////////////////////////
// Generic Acorn AST Parsing
//////////////////////////////

export function parse(code, options) {
  const ast = acorn.parse(code);
  return parseElement(ast, code, options);
}

export function parseElement(astElement, code, options) {
  const type = astElement.type;
  if (type === "Program") return parseElement(astElement.body[0], code, options);
  if (type === "ExpressionStatement") return parseElement(astElement.expression, code, options);
  if (type !== "JSXElement") {
  console.trace();
    throw new TypeError(`parseElement({type:'${type}'}): don't know how to parse this type.`);
  }

  const elementType = parseElementType(astElement);
  const Constructor = (options && options.getElementConstructor(elementType)) || Object;
  const element = new Constructor({
    type: elementType,
    selfClosing: astElement.openingElement.selfClosing
  });

  // parse attributes
  const attributeParser = options.parseAttributes || parseAttributes;
  const attributes = attributeParser(astElement, code, options);
  if (attributes) element.attributes = attributes;

  const astChildren = astElement.children;
  if (astChildren && astChildren.length !== 0) {
    astChildren.forEach(astChild => parseChild(element, astChild, code, options));
  }

  return element;
}

export function parseElementType(astElement, code, options) {
  return parseIdentifier(astElement.openingElement.name);
}

// Parse a JSXElement's `openingElement.attributes` and return an attributes object.
// Returns `undefined` if no attributes.
export function parseAttributes(astElement, code, options) {
  const astAttributes = astElement.openingElement.attributes;
  if (!astAttributes || !astAttributes.length) return undefined;

  const attributes = {};
  let spreadIndex = 0;
  astAttributes.forEach(astAttribute => {
    if (astAttribute.type === "JSXSpreadAttribute") {
      attributes[`...${spreadIndex++}`] = parseAttributeValue(astAttribute.argument, code, options);
      return;
    }
    if (astAttribute.type !== "JSXAttribute") {
      throw new TypeError(`parseAttribute({type:'${astAttribute.type}'}): we can only parse {type:'JSXAttribute'}.`)
    }
    const name = parseAttributeName(astAttribute.name, code, options);
    const value = parseAttributeValue(astAttribute.value, code, options);
//if (name === "func") console.warn(astAttribute, value);
    attributes[name] = value;
  });
  return attributes;
}

export function parseAttributeName(astName, code, options) {
  return parseIdentifier(astName, code, options);
}

export function parseAttributeValue(astValue, code, options) {
  // <div attr />  <== attr value is `true`
  if (astValue == null) return true;

  switch (astValue.type) {
    case "Literal":                 return astValue.value;
    case "JSXExpressionContainer":  return parseAttributeValue(astValue.expression, code, options);
    case "JSXElement":              return parseElement(astValue, code, options);
// NOTE: arrow functions work in FF, Chrome and Edge, but not in Safari, see:  http://caniuse.com/#feat=arrow-functions
//    case "ArrowFunctionExpression": return parseArrowFunction(astValue, code, options);
  }
  // pull out the code and add it to the astValue node
  astValue._code = code.substring(astValue.start, astValue.end);
  return astValue;
}



export function parseChild(parent, astChild, code, options) {
  const astType = astChild.type;
  let child;
  switch (astType) {
    case "Literal":
      child = parseChildLiteral(parent, astChild, code, options);
      break;

    case "JSXElement":
      child = parseChildElement(parent, astChild, code, options);
      break;

    default:
      throw new TypeError(`parseChild({astType:'${astType}'}): dont know how to parse this type.`);
  }
  // NOTE: we do NOT go through `parent.addChild()` here!
  if (child !== undefined) {
    if (!parent.children) parent.children = [];
    parent.children.push(child);
  }
}

export function parseChildLiteral(parent, astLiteral, code, options) {
  let value = astLiteral.value;
  if (typeof value === "string") {
    value = value.trim();
    // skip whitespace-only nodes
    // TOOD: match the React algorithm for this:
    //  https://github.com/facebook/react/pull/480
    if (value === "") return;
  }
  return value;
}

export function parseChildElement(parent, astElement, code, options) {
  const childType = parseElementType(astElement);

  // allow JSXElement subclasses to intercept certain children to do special stuff
  if (parent.constructor.specialChildParsers) {
    const specialHandler = parent.constructor.specialChildParsers[childType];
    if (specialHandler) {
      return specialHandler(parent, astElement, code, options);
    }
  }

  return parseElement(astElement, code, options);
}

export function parseIdentifier(ast, code, options) {
  const type = (ast && ast.type);
  if (type === "JSXIdentifier") return ast.name;
  throw new TypeError(`parseIdentifier({type:'${type}'}): we can only parse {type:'JSXIdentifier'}.`)
}


// Return the raw code inside astElement.
export function getElementChildrenCode(astElement, code, options) {
  if (astElement.selfClosing) return "";

  const start = astElement.openingElement.end;
  const end = astElement.closingElement.start;
  return code.substring(start, end);
}

// Export all as one map
export default Object.assign({}, exports);

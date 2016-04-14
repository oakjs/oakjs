//////////////////////////////
// Generic Acorn AST Parsing
//////////////////////////////

export default class AcornParser {
  static ElementConstructor = Object;

  parse(code, options = {}) {
    const ast = acorn.parse(code);
    return this.parseElement(ast, code, options);
  }

  getElementConstructor(type) {
    return Object;
  }

  parseElement(astElement, code, options) {
    const type = astElement.type;
    if (type === "Program") return this.parseElement(astElement.body[0], code, options);
    if (type === "ExpressionStatement") return this.parseElement(astElement.expression, code, options);
    if (type !== "JSXElement") {
      console.trace();
      console.warn(astElement);
      throw new TypeError(`parseElement({type:'${type}'}): dont know how to parse this type.`);
    }

    const elementType = this.parseElementType(astElement);
    const ElementConstructor = this.getElementConstructor(elementType);
    const element = new ElementConstructor({
      type: elementType,
      selfClosing: astElement.openingElement.selfClosing
    });

    // parse props
    const props = this.parseProps(element, astElement, code, options);
    if (props) element.props = props;

    // parse children
    this.parseChildren(element, astElement.children, code, options);

    return element;
  }

  parseElementType(astElement, code, options) {
    return this.parseIdentifier(astElement.openingElement.name);
  }

  // Parse a JSXElement's `openingElement.attributes` and return a `props` object.
  // Returns `undefined` if no props.
  parseProps(element, astElement, code, options) {
    const astAttributes = astElement.openingElement.attributes;
    if (!astAttributes || !astAttributes.length) return undefined;

    const props = {};
    let spreadIndex = 0;
    astAttributes.forEach(astAttribute => {
      if (astAttribute.type === "JSXSpreadAttribute") {
        props[`...${spreadIndex++}`] = this.parsePropValue(astAttribute.argument, code, options);
        return;
      }
      if (astAttribute.type !== "JSXAttribute") {
        throw new TypeError(`parseProps({type:'${astAttribute.type}'}): we can only parse {type:'JSXAttribute'}.`)
      }
      const name = this.parsePropName(astAttribute.name, code, options);
      const value = this.parsePropValue(astAttribute.value, code, options);
  //if (name === "func") console.warn(astAttribute, value);
      props[name] = value;
    });
    return props;
  }

  parsePropName(astName, code, options) {
    return this.parseIdentifier(astName, code, options);
  }

  parsePropValue(astValue, code, options) {
    // <div attr />  <== attr value is `true`
    if (astValue == null) return true;

    switch (astValue.type) {
      case "Literal":                 return astValue.value;
      case "JSXExpressionContainer":  return this.parsePropValue(astValue.expression, code, options);
      case "JSXElement":              return this.parseElement(astValue, code, options);
  // NOTE: arrow functions work in FF, Chrome and Edge, but not in Safari, see:  http://caniuse.com/#feat=arrow-functions
  //    case "ArrowFunctionExpression": return this.parseArrowFunction(astValue, code, options);
    }
    // pull out the code and add it to the astValue node
    astValue._code = code.substring(astValue.start, astValue.end);
    return astValue;
  }


  parseChildren(parent, astChildren, code, options) {
    const children = this._parseChildren(parent, astChildren, code, options);
    if (children && children.length) parent.children = children;
  }

  _parseChildren(parent, astChildren, code, options) {
    if (!astChildren || astChildren.length === 0) return [];

    return astChildren.map(astChild => this.parseChild(parent, astChild, code, options))
      .filter(child => child !== undefined);
  }

  parseChild(parent, astChild, code, options) {
    const astType = astChild.type;
    let child;
    switch (astType) {
      case "Literal":
        return this.parseChildLiteral(parent, astChild, code, options);

      case "JSXElement":
        return this.parseChildElement(parent, astChild, code, options);

      default:
        throw new TypeError(`parseChild({astType:'${astType}'}): dont know how to parse this type.`);
    }
  }

  parseChildLiteral(parent, astLiteral, code, options) {
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

  parseChildElement(parent, astElement, code, options) {
    return this.parseElement(astElement, code, options);
  }

  parseIdentifier(ast, code, options) {
    const type = (ast && ast.type);
    if (type === "JSXIdentifier") return ast.name;
    throw new TypeError(`parseIdentifier({type:'${type}'}): we can only parse {type:'JSXIdentifier'}.`)
  }
}

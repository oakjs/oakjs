//////////////////////////////
// Specialized JSXElement Parser
//////////////////////////////

import AcornParser from "oak-roots/AcornParser";
import ids from "oak-roots/util/ids";

import JSXElement from "./JSXElement";
import JSXFragment from "./JSXFragment";

export default class JSXParser extends AcornParser {
  //////////////////////////////
  // Parsing Registry
  // Add classses which you want to have ALWAYS instantiate as a certain type of JSXElement
  //  as:  `JSXParser.registerType("YourTypeName", YourSubclass);`
  //////////////////////////////

  static TYPE_REGISTRY = {};
  static registerType(type, constructor) {
    JSXParser.TYPE_REGISTRY[type] = constructor;
  }

  getElementConstructor(type) {
    return JSXParser.TYPE_REGISTRY[type] || JSXElement;
  }

  // Add a unique-ish `oid` property to all nodes as we parse node props.
  // NOTE: this will then be saved with the node...
  parseProps(element, astElement, code, options) {
    const props = super.parseProps(element, astElement, code, options) || {};

    // make sure we've got an oid that's unique within options.oids
    while (!props.oid || (props.oid in options.oids)) {
      props.oid = (options.getRandomOid ? options.getRandomOid() : JSXFragment.getRandomOid() );
    }
    // point to the element by oid for later
    options.oids[props.oid] = element;

    return props;
  }

  parseChild(parent, astElement, code, options) {
    const child = super.parseChild(parent, astElement, code, options);
    if (child instanceof JSXElement) {
      // have children point back to their parent
      if (parent.oid) child._parent = parent.oid;
    }
    return child;
  }

}

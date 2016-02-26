//////////////////////////////
//
//  Registry class
//
//////////////////////////////

export default class Registry {
  constructor() {
    this.__REGISTRY__ = {};
  }

  // Get something already present in the registry.
  get(...path) {
    return this.__REGISTRY__[path.join("/")];
  }

  // Add `thing` to the registry.
  add(thing, ...path) {
    if (!thing || typeof thing !== "object") {
      throw new TypeError("registry.add("+thing+",",path,"): thing to add must be an object");
    }
    if (!path.length || !path.every(step => (typeof step === "string" || typeof step === "number"))) {
      throw new TypeError("registry.add("+thing+",",path,"): path must be strings!");
    }
    return (this.__REGISTRY__[path.join("/")] = thing);
  }

  // Clear the thing in the registry at `path`.
  clear(...path) {
    delete this.__REGISTRY__[path.join("/")];
  }

}

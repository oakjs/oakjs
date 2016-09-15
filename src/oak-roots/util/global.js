//////////////////////////////
//  Return the `global` / `window` etc object
//
//  Usage:    import global from "oak-roots/util/global"
//
//////////////////////////////

let _global;
if (typeof global !== "undefined") {
  _global = global;
  _global.isServer = true;
}
else if (typeof window === "undefined") {
  _global = window;
  _global.global = window;
  _global.isBrowser = true;
}
else if (typeof self !== "undefined") {
  _global = self;
  _global.global = self;
  _global.isBrowser = true;
}
else {
  throw new Error('unable to locate global object');
}

export default _global;

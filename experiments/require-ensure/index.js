/////////////////
//
//  `require.ensure()` allows you to dynamically (at runtime) load the exports payload of a specific file.
//
//  The file will NOT be included in your normal build,
//  and getting the file payload will be asynchronous.
//
//  eg:
//    `global.dynamic1 = function(callback) { require.ensure([], () => callback(require("./Dynamic1.jsx")) ) }`
//
//  later:
//    dynamic1( (results) => console.warn(results) );
//
//  So you can load the thing dynamically, but the results will come in a promise.
//
/////////////////


export function dynamic1(callback) {
  require.ensure([], () => callback(require("./Dynamic1.jsx")))
}

export function dynamic2(callback) {
  require.ensure([], () => callback(require("./Dynamic2.jsx")))
}

export default {...exports};



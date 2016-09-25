/////////////////
//
//  `require.context()` allows you to statically (at bundle time) import a dynamic set of files.
//
//  eg:  `global.req = require.context("babel|.", true, /^\.\/.*\.jsx$/);`
//
//  Will make the global `req` function something you can use to get each of the jsx files in the current directory.
//  eg:  `req("./foo.jsx")` will return the default export of `foo.jsx` at runtime (synchronously).
//
//  NOTE: this does NOT allow for dynamic loading at runtime, the file will be included in your package.
//
/////////////////

const req = require.context(
  "babel!.",            // process with babel
  true,                 // recurse
  /^\.\/.*\.jsx$/       // grab all .jsx files
);

export default req;

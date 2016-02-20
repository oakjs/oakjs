// Bring acorn + jsx parsing into the browser.
//
// `cd` into this directory and
//  `> rollup -c`
// which builds
//  `/client/public/lib/acorn.js`
// and exports an `acorn` global.
//
const acorn = require("acorn-jsx");
// Use JSX and ES6 options in acorn by default.
acorn.defaultOptions.plugins = { jsx: true };
acorn.defaultOptions.ecmaVersion = 6;

module.exports = acorn;

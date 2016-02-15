// Bring acorn + jsx parsing into the browser.
const acorn = require("acorn-jsx");
if (typeof window !== undefined) window.acorn = acorn;

// Use JSX and ES6 options in acorn by default.
acorn.defaultOptions.plugins = { jsx: true };
acorn.defaultOptions.ecmaVersion = 6;

//////////////////////////////
//  Babel Utility functions
//
// NOTE: We're currently dependent on a global `Babel` being set in the browser from:
//        https://github.com/Daniel15/babel-standalone
//////////////////////////////

// Set to true to show debug output in this file.
const DEBUG = false;

// Make sure babel is available (on the server side).
import global from "oak-roots/util/global";

if (DEBUG) console.info("Initializing babel");

var babelOptions;
// If running on the server where Babel is not defined
if (!global.Babel) {
  // Load babel-core if necessary, which is currently at version 5.8
  if (DEBUG) console.info("-- requiring babel core");
  global.Babel = require("babel-core");

  // set up babel 5 options
	babelOptions = {
    "stage": 1,
    externalHelpers: true
  }
}
// If in the browser
else {
  if (DEBUG) console.info("-- using pre-loaded Babel object");

  // Use babel v6 options
  babelOptions = {
    "presets": ["stage-1", "react"],
    "plugins": [
      "transform-object-rest-spread",
      "transform-es2015-destructuring",
      "transform-decorators-legacy"
    ]
  };
}
if (DEBUG) console.info("-- babel version", Babel.version);
if (DEBUG) console.info("-- babel options: ", babelOptions);

import { normalizeIdentifier } from "./ids";


// Set up the presets and plugins we'll use for babel transformation.
// Note that on the server, these will automatically be loaded from `node_modules`.

export function transform(code) {
  try {
    return Babel.transform(code, babelOptions).code;
  }
  catch (e) {
    console.error("Error transforming code with babel: ", e);
    console.log(code);
  }
}

export function evaluate(code) {
  const transformed = transform(code);
  return eval(code);
}

export function transformExpression(expression) {
  const code = `(function(){ return (${expression}) })()`;
  return transform(code);
}

export function evaluateExpression(code) {
  const transformed = transformExpression(code);
  return eval(transformed);
}

// Create an actual class object.
// TODO: Doing this via an `eval` is inherently slower in at least Chrome.
//       Better would be to install it via a <script> tag or some other mechanism.
export function createClass(script, Super, ClassName) {
  const es2015Code = getClassScript(script, "Super", ClassName);
  // NOTE: we have to transfom/eval here to pick up the reference to `Super`.
  const es5Code = transformExpression(es2015Code);
  return eval(es5Code);
}

// Return ES2015 code to create a class.
// If you want to actually create an in-memory class, use `createClass()` instead.
//
// - `script` is a block of class method/property/etc definitions (ES2015 style)
//    or an array of the same.
// - `SuperName` is the optional name of the superclass.
//    It's up to you to make sure the name is valid in the executing scope.
// - `ClassName` is the optional name for the class.
//    We'll normalize this to make sure it's a legal JS identifier.
export function getClassScript(script = "", superClassName, className) {
  // Merge array of scripts together.
  if (Array.isArray(script)) script = script.join("\n\n");

  // Normalize class name to make sure it's a legal identifier.
  const normalizedClassName = normalizeIdentifier(className, "AClass");

  if (!superClassName) {
    return [
        `class ${normalizedClassName} {`,
        `  ${script}`,
        `}`
      ].join("\n");
  }

  return [
      `class ${normalizedClassName} extends ${superClassName} {`,
      `  ${script}`,
      `}`
    ].join("\n");
}


// Export all as a lump
export default {...exports};

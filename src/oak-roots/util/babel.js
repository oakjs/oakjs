//////////////////////////////
//  Babel Utility functions
//
// NOTE: We're currently dependent on a global `Babel` being set in the browser from:
//        https://github.com/Daniel15/babel-standalone
//////////////////////////////

import { normalizeIdentifier } from "./ids";

//import Babel from "babel-core";


export const babelOptions = {
  presets: ["stage-1", "react"],
  plugins: [ "transform-object-rest-spread", "transform-es2015-destructuring"]
}

export function transform(code) {
  return Babel.transform(code, babelOptions).code;
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


export default Object.assign({}, exports);

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

export function createClass(script, Super, ClassName) {
  let code;
  const normalizedClassName = normalizeIdentifier(ClassName, "AClass");
  if (!Super) {
    code = [
      `class ${normalizedClassName} {`,
      `  ${script || ""}`,
      `}`
    ]
  }
  else {
    code = [
      `class ${normalizedClassName} extends Super {`,
      `  ${script || ""}`,
      `}`
    ]
  }
  const transformed = transformExpression(code.join("\n"));
  return eval(transformed);
}

export default Object.assign({}, exports);

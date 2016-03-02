//////////////////////////////
//  Babel Utility functions
//
//////////////////////////////

import { normalizeIdentifier } from "./ids";

// NOTE: we're currently dependent on a global `Babel` being set in the browser...
//import Babel from "babel-core";

export function transform(code) {
  return Babel.transform(code, { presets: ["es2015", "react"], plugins: ["external-helpers-2"] }).code;
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

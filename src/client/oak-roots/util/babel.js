//////////////////////////////
//  Babel Utility functions
//
//////////////////////////////

// NOTE: we're currently dependent on a global `Babel` being set in the browser...
//import Babel from "babel-core";

export function transform(code) {
  return Babel.transform(code, { presets: ["es2015"], plugins: ["external-helpers-2"] }).code;
}

export function transformExpression(expression) {
  const code = `(function(){ return (${expression}) })()`;
  return transform(code);
}

export function evaluate(code) {
  const transformed = transform(code);
  return eval(code);
}


export default Object.assign({}, exports);

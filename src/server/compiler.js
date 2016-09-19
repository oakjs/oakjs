//////////////////////////////
//  "Compile" JSXE/JS/etc code into a single class expression, write it to a file, etc.
//
//  JSX: assume we should just compile and return the exports???
//  JSXE + JS: combine with JS into a class (based on what?)
//  LESS => compile into CSS
//  CSS => attach a stylesheet load to loading of the class
//
//////////////////////////////

import babel from "../oak-roots/util/babel.js";
import ComponentController from "../oak/ComponentController";
import JSXFragment from "../oak/JSXFragment";

import util from "./util";


// Set to `true` to output debug messages during compilation
const DEBUG = false;



// Compile the files that make up a server side 'Component' into a single `class` definition script.
// Returns a promise which yields the resulting class script.
//
//  `className`, `superClassName` and `format` are the same as `compileJSXE()`
// TODO: index?
export function compileComponent(options) {
  // figure out the paths based on the component
  const { component, ...compileOptions } = options;
  const paths = [
    component.jsxePath,
    component.scriptPath,
    component.stylesPath,
  ];
  return util.readPaths(paths, { optional: true })
    .then( ([ jsxe, js, css ]) => {

      // pull the file results into the `compileOptions`
      compileOptions.jsxe = jsxe;
      compileOptions.js = js;
      compileOptions.css = css;

      return compileJSXE(compileOptions);
    })
}




// Compile `jsxe`, `js` and/or `css` files into a single `class` definition script.
//
// If `format` is "ES5", we'll output as an `ES5` script,
//  otherwise we'll return the `ES2015` source.
//
// TODO: stick CSS in there somehow to be auto-installed...
// TODO: index?
// TODO: `less`
// TODO: `ignoreOids`
export function compileJSXE(options) {
  const {
    jsxe,                               // optional JSXE string fragment
    js = "",                            // optional JS class methods/etc
    css,                                // optional CSS code
    className,                          // Name for output `class`
    superClassName = "oak.Component",   // Name of superclass.
    format = "ES2015",                  // "ES5" or "ES2015" for language version.
    prefix                              // Prefix for output script, eg:
                                        //  `export default` or
                                        //  `global.foo.bar =`, etc
  } = options;

  let render = "";
  // construct render method dynamically from jsxe
  if (jsxe) {
    try {
      // UGH, we need a `controller` to get the render source (for renderVars)
      const controller = new ComponentController();
      const fragment = JSXFragment.parse(jsxe, { controller });
      render = fragment._getRenderSource("  ");
    }
    catch(e) {
      console.error("Error creating render from jsxe fragment:", e);
      console.log(jsxe);
      render = "";
    }
  }

  const scripts = [
    render,
    js,
  ];

  // add css + css installer logic
  if (css) {
    scripts.unshift([
// NOTE: Currently the css is being set up in `ComponentController.loadJSX()` on the front end...
//       This only installs the stylesheet once per JSX load.
//       "constructor(props) {",
//       "    super(props);",
//       "    // oak.installStyles(this.path, this.constructor.css);",
//       "  }",
//       "",
      `  static css = ${JSON.stringify(css)};`
    ].join("\n"));
  }

  try {
    var es2015Class = babel.getClassScript(scripts, superClassName, className);
  }
  catch(e) {
    console.error("Error creating class script:", e);
    console.log(jsxe);
    render = "";
  }

  // If `prefix` was specified, tack that on the front
  if (prefix) es2015Class = `${prefix} ${es2015Class}`;

  if (DEBUG) console.warn("es2105 class:\n", es2015Class);

  if (format === "ES5") {
    if (DEBUG) console.warn("transforming to es5");
    let es5Class = babel.transformExpression(es2015Class);

    // remove the "use strict" which will mess consumers up...
    es5Class = es5Class.replace('"use strict";', "");

    if (DEBUG) console.warn("es5 class:\n", es5Class);
    return es5Class;
  }

  return es2015Class;
}



// Export all as a single object.
export default Object.assign({}, exports);

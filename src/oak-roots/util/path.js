"use strict";

// Split a `dotted.object[path][0].foo` into an array of numbers and strings:
//		["dotted","object","path",0,"foo"]
const PATH_PATTERN = /(\.|\[[^\]]+\])/;
const PATH_REGISTRY = {};

export function splitPath(pathString) {
  if (!pathString || typeof pathString !== "string") return undefined;

  // return previuosly parsed value
  if (PATH_REGISTRY[pathString]) return PATH_REGISTRY[pathString];

  const path = pathString.trim().split(PATH_PATTERN);
  try {
    // normalize path, removing "." and translating "[...]"
    for (let i = path.length-1, step; i >= 0; i--) {
      step = path[i].trim();
      // eat periods
      if (!step || step === ".") {
        path.splice(i,1);
        continue;
      }
      // convert `[x]` to `x`.  If `x` is a number, convert it.
      if (step[0] === "[") {
        // strip of end ]
        if (step[step.length-1] !== "]") throw "missing end ]";
        step = step.substr(1, step.length-2).trim();

        // convert to int
        const asInt = parseInt(step);
        if (""+asInt === step) {
          step = asInt;
        }
        else {
          // strip off single quotes
          if (step[0] === '"') {
            if (step[step.length-1] !== '"') throw "missing end \"";
            step = step.substr(1, step.length-2).trim();
          }
          // strip off double quotes
          if (step[0] === "'") {
            if (step[step.length-1] !== "'") throw "missing end '";
            step = step.substr(1, step.length-2).trim();
          }
        }
      }
      path[i] = step;
    }
    PATH_REGISTRY[pathString] = path;
    return path;
  }
  catch (msg) {
    console.error("splitPath('"+pathString+"'): invalid step '"+step+"': "+msg);
    return undefined;
  }
}


export function getPath(pathString, object) {
  if (object == null || !pathString) return object;
  const path = splitPath(pathString);
  if (!path) return undefined;

  let target = object;
  for (let i = 0; i < path.length; i++) {
    const key = path[i];
    if (target == null || target[key] == null) return undefined;
    target = target[key];
  }
  return target;
}

export function setPath(value, pathString, object) {
  if (object == null) return object;
  const path = splitPath(pathString);
  if (!path) return object;
  let target = object;
  if (path.length > 1) {
    // advance to last item
    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i];

      // create arrays or objects as necessary
      if (target[key] == null) {
        if (typeof path[i+1] === "number") 	target[key] = [];
        else								target[key] = {};
      }
      target = target[key];
    }
  }
  const key = path[path.length-1];
  if (value === undefined) {
    delete target[key];
  }
  else {
    target[key] = value;
  }
  return value;
}



// Interpolate a `string` with one or more `scope` objects
// Roughly the semantics as ES2015 string interpolation,
//  but you use a regular string, and pass in a scope object.
//
// TODO: mutliple scope objects!
//
export const INTERPOLATE_TEMPLATE_PATTERN = /\$\{([^}]*)\}/;
export function interpolate(string, scope) {
  // yields:  ["string", "<match_string>", "string", "<match_string>", "string"]
  const matches = string.split(INTERPOLATE_TEMPLATE_PATTERN);
  return matches.map( (token, index) => {
    // even bits are literal strings
    if (index % 2 === 0) return token;

    // odd bits are substitutions
    const replacement = getPath(token, scope);
    return (replacement == null ? "" : replacement);
  }).join("");
}


// Export all as a single object
export default Object.assign({}, exports);

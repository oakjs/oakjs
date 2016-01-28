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


export function getPath(object, pathString) {
  if (object == null) return object;
  const path = splitPath(pathString);
  if (!path) return object;

  let target = object;
  for (let i = 0; i < path.length; i++) {
    const key = path[i];
    if (target == null || target[key] == null) return undefined;
    target = target[key];
  }
  return target;
}

export function setPath(object, pathString, value) {
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

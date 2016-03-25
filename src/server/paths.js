//////////////////////////////
// Server-side project managment class
// NOTE: instantiating a project is really lightweight
//       so you can do so dynamically when servicing requests.
//////////////////////////////

import fsPath from "path";

import config from './config';


//////////////////////////////
//  Project Index
//////////////////////////////

// Lightweight object which vends paths
//  eg:   const path = paths.projects().projectIndexPath;
export class appPaths {
  get projectIndex() { return projectsPath("projects.json") }
}

// Return the path for a project file.
// Default is to return the `project.jsx` file, pass a different `fileName` for something else.
// If you want the path to the project's directory, pass `fileName=""`.
export function projectsPath(filename = "") {
  if (!isValidPath(filename)) throw new TypeError(`Invalid path: '${filename}'`);
  return fsPath.join(config.paths.projects, filename);
}



//////////////////////////////
//  Paths for projects
//////////////////////////////

// Lightweight object which vends paths
//  eg:   const path = paths.project(<projectId>).jsxePath;
export class projectPaths {
  constructor(project) {
    this.project = dieIfInvalidId(project);
  }
  get jsxe() { return projectPath(this.project, "project.jsxe") }
  get css() { return projectPath(this.project, "project.css") }
  get script() { return projectPath(this.project, "project.js") }
  get stackIndex() { return projectPath(this.project, "stacks.json") }
  get bundleFile() { return bundlePath("projects", `${this.project}.bundle.json`) }
}

// Return the path for a project file.
// Default is to return the `project.jsx` file, pass a different `fileName` for something else.
// If you want the path to the project's directory, pass `fileName=""`.
export function projectPath(project, filename = "") {
  const projectPath = fsPath.join(project, filename);
  return projectsPath(projectPath);
}

//////////////////////////////
//  Paths for stacks
//////////////////////////////

// Lightweight object which vends paths
//  eg:   const path = paths.stack(<projectId>, <stackId>).jsxePath;
export class stackPaths {
  constructor(project, stack) {
    this.project = dieIfInvalidId(project);
    this.stack = dieIfInvalidId(stack);
  }
  get jsxe() { return stackPath(this.project, this.stack, "stack.jsxe") }
  get css() { return stackPath(this.project, this.stack, "stack.css") }
  get script() { return stackPath(this.project, this.stack, "stack.js") }
  get cardIndex() { return stackPath(this.project, this.stack, "cards.json") }
  get bundleFile() { return bundlePath("projects", this.project, `${this.stack}.bundle.json`) }
}


// Return the path for a stack file.
// Default is to return the `stack.jsx` file, pass a different `fileName` for something else.
// If you want the path to the stack's directory, pass `fileName=""`.
export function stackPath(project, stack, filename = "") {
  const stackPath = fsPath.join(stack, filename);
  return projectPath(project, stackPath);
}

//////////////////////////////
//  Paths for cards
//////////////////////////////

// Lightweight object which vends paths
//  eg:   const path = paths.card(<projectId>, <stackId>, <cardId>).jsxePath;
export class cardPaths {
  constructor(project, stack, card) {
    this.project = dieIfInvalidId(project);
    this.stack = dieIfInvalidId(stack);
    this.card = dieIfInvalidId(card);
  }
  get jsxe() { return cardPath(this.project, this.stack, this.card, "card.jsxe") }
  get css() { return cardPath(this.project, this.stack, this.card, "card.css") }
  get script() { return cardPath(this.project, this.stack, this.card, "card.js") }
  get bundleFile() { return bundlePath("projects", this.project, this.stack, `${this.card}.bundle.json`) }
}

// Return the path for a card file.
// Default is to return the card's `.jsx` file, pass a different `filename` for something else.
export function cardPath(project, stack, card, filename="") {
  const cardPath = fsPath.join(card, filename);
  return stackPath(project, stack, cardPath);
}


//////////////////////////////
//  Build files
//////////////////////////////

// Return build file path for `buildFile`.
export function buildPath(buildFile) {
  if (!isValidPath(buildFile)) throw new TypeError(`Invalid build path: ${buildFile}`);
  return fsPath.join(config.paths.build, buildFile);
}

// Return bundle path for a project
// NOTE: this will be relative to the `build` directory and should NOT return an absolute path.
export function bundlePath(...segments) {
  const path = fsPath.join(...segments);
  if (!isValidPath(path)) throw new TypeError(`Invalid bundle path: ${buildFile}`);
  return path;
}

//////////////////////////////
//  Path utilities
//////////////////////////////

export const VALID_ID_EXPRESSION = /^([\$_\w][\$_\-\w\d$]*)$/;
export function dieIfInvalidId(id) {
  if (typeof id !== "string" || !VALID_ID_EXPRESSION.test(id)) {
    throw new TypeError(`invalid id: ${id}`)
  }
  return id;
}

export function isValidPath(path) {
  if (typeof path !== "string") return false;
  // don't allow '//'
  if (path.includes(fsPath.sep+fsPath.sep)) return false;
  return path.split(fsPath.sep).every(segment => segment !== "." && segment !== "..");
}

// Return `true` if `path` starts with one of the specified `prefixes`
export function hasPrefix(path, ...prefixes) {
  if (typeof path !== "string") return false;
  return prefixes.some(prefix => path.startsWith(prefix));
}

export function isLegalClientPath(path) {
  return isValidPath(path) && hasPrefix(path, "public/", "projects/", "_theme/");
}


// Given a disk file `path` which is either:
//  - an absolute path, or
//  - a path that begins with one of our `config` directories as defined in `webpack.common.js::paths`
// normalize it to an absolute path.
//
// If the `options` specifies:
//  - `basePath`, we'll tack that on the beginning of the `path`
//  - `trusted` as `false`, we'll reject absolute paths or invalid paths according to `isValidPath()`.
//    (e.g., you should set `trusted: false` if the path specification comes from the browser)
export function configPath(path, options = {}) {
  const { basePath = "", trusted = true} = options;
  const fullPath = fsPath.join(basePath, path);
  if (!trusted && !isLegalClientPath(fullPath)) throw new TypeError(`ERROR in configPath(): illegal client path ${fullPath}`);

  // if we got an absolute path, just return it
  if (fullPath.startsWith(fsPath.sep)) return fullPath;

  const segments = fullPath.split(fsPath.sep);
  const pathName = segments[0];
  if (config.paths[pathName] === undefined) throw new TypeError(`ERROR in configPath(): prefix ${pathName} not found for ${fullPath}`);

  segments[0] = config.paths[pathName];
  return fsPath.join(...segments);
}


// Assign all exports as a single object
export default Object.assign({}, exports);

//////////////////////////////
// Server-side paths and generic file manipulation.
//////////////////////////////

import fsp from "fs-promise";
import fsPath from "path";
import config from './config';

//////////////////////////////
//  Generic save / delete / rename
//  Use
//////////////////////////////

// Return a text file.
// If you pass a `response`, we'll have the response send the file from the disk.
// With no `response`, we'll return a promise which resolves with the file's contents.
export function getTextFile(path, response, encoding = "text/plain") {
  if (response) {
    response.set("Content-Type", encoding);
    return response.sendFile(path);
  }
  return fsp.readFile(path, "utf8");
}

// Return a JSON file formatted.
// Same semantics as `getTextFile()`
export function getJSONFile(path, response, encoding = "application/json") {
  return getTextFile(path, response, encoding);
}

// Save a file without any formatting.
export function saveFile(path, contents) {
  return fsp.outputFile(path, contents);
}

// Save a JSON blob to a file.
export function saveJSON(path, json) {
  return fsp.outputFile(path, JSON.stringify(json, undefined, 2));
}

// If `contents` is falsy, delete the file at `path` (if it exists).
// Otherwise save `contents` to `path`.
export function saveOrDeleteFile(path, contents) {
  if (contents) return saveFile(path, contents);
  return deleteExistingFile(path)
}

// Delete a file, rejecting if it doesn't exist.
// Use `deleteExistingFile()` if you don't care whether it exists or not.
export function deleteFile(path) {
  return fsp.unlink(path);
}

// Delete a file, but return a resolved promise if the file doesn't actually exist.
export function deleteExistingFile(path) {
  return deleteFile(path).catch(Function.prototype);
}

export function renameFile(oldPath, newPath) {
  return fsp.rename(oldPath, newPath);
}

export function removeFile(path) {
  return fsp.remove(path);
}

export function moveFile(path, newPath, clobber = true) {
  return fsp.move(path, newPath, { clobber });
}

export function copyFile(path, newPath) {
  return fsp.copy(path, newPath);
}

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

export const projectIndexPath = projectsPath("projects.json");

//////////////////////////////
//  Paths for projects
//////////////////////////////

// Return the path for a project file.
// Default is to return the `project.jsx` file, pass a different `fileName` for something else.
// If you want the path to the project's directory, pass `fileName=""`.
export function projectPath(project, filename = "") {
  const projectPath = fsPath.join(project, filename);
  return projectsPath(projectPath);
}

//////////////////////////////
//  Paths for sections
//////////////////////////////

// Return the path for a section file.
// Default is to return the `section.jsx` file, pass a different `fileName` for something else.
// If you want the path to the section's directory, pass `fileName=""`.
export function sectionPath(project, section, filename = "") {
  const sectionPath = fsPath.join(section, filename);
  return projectPath(project, sectionPath);
}


//////////////////////////////
//  Paths for pages
//////////////////////////////

// Return the path for a page file.
// Default is to return the page's `.jsx` file, pass a different `filename` for something else.
export function pagePath(project, section, page, filename="") {
  const pagePath = fsPath.join(page, filename);
  return sectionPath(project, section, pagePath);
}


//////////////////////////////
//  Path for project/page/section "trash"
//////////////////////////////
export function trashPath(...steps) {
  // NOTE: we can't nest trash paths
  const path = "_trash/" + steps.join("-");
  return projectsPath(path);
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
export function dieIfInvalidId(id, key = id) {
  if (typeof id !== "string" || !VALID_ID_EXPRESSION.test(id)) {
    const message = `invalid ${key}: ${id}`;
    console.error("ERROR: " + message);
    console.trace();
    throw new TypeError(message)
  }
  return id;
}

export function isValidPath(path) {
  if (typeof path !== "string") return false;
  // don't allow '//'
  if (path.includes(fsPath.sep+fsPath.sep)) return false;
// REFACTOR: don't allow paths beginning with a period (which also knocks out "." and "..")?
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

import fsp from "fs-promise";

import { interpolate } from "../oak-roots/util/path";

// Returns a promise which yields the mod date of file at path as an ISO string.
// Resolves with `undefined` if file doesn't exist.  (DOES NOT REJECT THE PROMISE)
export function lastModified(path) {
  if (!path) return Promise.resolve(undefined);
  return fsp.stat(path)
    .then(stat => stat.mtime.toISOString())
    .catch(error => undefined);
}

// Returns a promise which yields the latest mod date for any of the files in `paths`.
// If a file isn't found, it is ignored.
// If none of the files are found, result will be `undefined`.
export function latestModified(...paths) {
  const modDatePromises = paths.map(path => lastModified(path));
  return Promise.all(modDatePromises)
    .then( latestTimestamp );
}

// Given a bunch of Date timestamps from `lastModified` (which may be `undefined`),
//  return the latest one.
export function latestTimestamp(timestamps) {
  return timestamps.reduce( (prev, current) => {
    if (!current) return prev;
    if (!prev) return current;
    return (current > prev ? current : prev);
  });
}


// Given a list of server file paths, return a promise which yields all of their contents as an array.
//
// If any files aren't found, rejects the promise.
// Pass `options.optional = true` to ignore files which can't be found.
//
// if `options.optional` is `true`, missing files will yield the empty string rather than failing the promise.
export function readPaths(paths, options = {}) {
  const {
    encoding,
    optional = false
  } = options;

  let promises = paths.map( path => fsp.readFile(path, encoding || "utf8") );
  if (optional) promises = promises.map( promise => promise.catch( () => undefined ));
  return Promise.all(promises)
}


// Concatenate a bunch of files together, writing `delimiter` before each one.
// Returns a promise which yields them all as a big honking string.
//
// If any files aren't found, rejects the promise.
// Pass `options.optional = true` to ignore files which can't be found.
//
// You can pass a `${path}` substitution in the delimiter (but make it a regular string)
//
// TODO: this could probably be made smarter with streams...
export function concatPaths(paths, options = {}) {
  const {
    delimiter = "\n",
  } = options;

  return this.readPaths(paths, options)
    .then( allFiles => {
      return allFiles.map( (fileOutput, index) => {
        return interpolate(delimiter, { path: paths[index] }) + fileOutput;
      }).join("\n")
    })
    .catch( error => {
      // log the error
      if (error.path)   console.error("Couldn't load file at "+error.path);
      else              console.error("Error in concatPaths: ", error);
      // re-throw
      throw error;
    });
}


// Concatenate a bunch of files together, returning results as a JSON blob
//  in the shape of the original map.
//
// Returns a promise which yields them all as a JSON string.
//
// If any files aren't found, rejects the promise.
// Pass `options.optional = true` to ignore files which can't be found.
//
// TODO: this could probably be made smarter with streams...
export function concatPathMap(pathMap, options = {}) {
  const keys = Object.keys(pathMap);
  const paths = keys.map(key => pathMap[key]);

  return this.readPaths(paths, options)
    .then( results => {
      const output = {};
      keys.forEach( (key, index) => {
        output[key] = results[index];
      });
      return output;
    })
    .catch( error => {
      // log the error
      if (error.path)   console.error("Couldn't load file at "+error.path);
      else              console.error("Error in concatPathMap: ",  error);
      // re-throw
      throw error;
    });
}



// Export all as a group
export default {...exports};

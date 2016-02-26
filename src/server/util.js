import fsp from "fs-promise";

import { interpolate } from "../oak-roots/util/path";

// Returns a promise which yields the mod date of file at path.
// Resolves with `undefined` if file doesn't exist.  (DOES NOT REJECT THE PROMISE)
export function lastModified(path) {
  if (!path) return Promise.resolve(undefined);
  return fsp.stat(path)
    .then(stat => stat.mtime)
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

// Given a bunch of string timestamps from `lastModified` (which may be `undefined`),
//  return the latest one.
export function latestTimestamp(timestamps) {
  return timestamps.reduce( (prev, current) => {
    if (typeof current !== "string") return prev;
    if (typeof prev !== "string") return current;
    return (current > prev ? current : prev);
  });
}

// Concatenate a bunch of files together, writing `delimiter` before each one.
// Returns a promise which yields them all as a big honking string.
//
// If any files aren't found, throws an error.
// You can pass a `${path}` substitution in the delimiter (but make it a regular string)
//
// TODO: this could probably be made smarter with streams...
export function concatPaths(paths, options = {}) {
  const {
    encoding = "utf8",
    delimiter = "\n",
    optional = false
  } = options;

  let promises = paths.map( path => fsp.readFile(path, encoding) );
  if (optional) promises = promises.map( promise => promise.catch( () => undefined ));
  return Promise.all(promises)
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


// Concatenate a bunch of files together, writing results as a JSON blob
//  in the shape of the original map.
// Returns a promise which yields them all as a JSON object.
//
// If any files aren't found, throws an error.
//
// TODO: this could probably be made smarter with streams...
export function concatPathMap(pathMap, options = {}) {
  const keys = Object.keys(pathMap);
  const paths = keys.map(key => pathMap[key]);

  const {
    encoding = "utf8",
    optional = false
  } = options;


  let promises = paths.map( path => fsp.readFile(path, encoding) );
  if (optional) promises = promises.map( promise => promise.catch( () => undefined ));

  return Promise.all(promises)
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
export default Object.assign({}, exports);

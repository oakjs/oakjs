import fse from "fs-extra";
import fsp from "fs-promise";
import fsPath from "path";

import objectUtil from "../oak-roots/util/object";

import apiPaths from "./paths";
import util from "./util";


// Set to `true` to output debug messages during bundling
export const DEBUG = true;

// "Clever" bundle routine:
//  - reads `options.inputFile` and adds that to the options
//  - normalizes `options.bundleFile`, `options.paths`, and `options.pathMap`
//  - munges `options.contentType` appropriately
export function bundle(options) {
  if (!("debug" in options)) options.debug = DEBUG;

  if (options.debug) console.log("bundle()");

  // Parse an `inputFile` specified in the options first
  return parseBundleInputFile(options)
    .then(options => {
      if (options.debug) { // (don't log response)
        let { response, ...inputOptions } = options;
        console.log("..options:\n", inputOptions);
        if (options.response) console.log("..returning results via express response");
      }

      // If we're bundling a map
      if (options.type === "map" || "pathMap" in options) {
        // normalize `pathMap` to an object if necessary
        if (typeof options.pathMap === "string") {
          options.pathMap = JSON.parse(pathMap);
        }
        return bundlePathMap(options.pathMap, options);
      }

      // otherwise we're just bundling a list of `paths` together
      return bundlePaths(options.paths, options);
    });
}

// Bundle a map of `{ key: path }` together and return response as JSON.
// NOTE: paths in `pathMap` and `options.bundleFile` should be full paths!
export function bundlePathMap(pathMap, options = {}) {
  if (!("debug" in options)) options.debug = DEBUG;

  if (options.debug) console.log("..bundlePathMap()\n", pathMap);
  if (!pathMap) throw new TypeError("map bundle didn't specify a 'pathMap'");

  // normalize `pathMap`
  options.pathMap = objectUtil.mapToObject(pathMap, (path, key) => apiPaths.configPath(path, options));
  options.keys = Object.keys(options.pathMap);
  options.paths = objectUtil.values(options.pathMap);

  // normalize bundleFile
  if (options.bundleFile) {
    options.bundleFile = apiPaths.buildPath(options.bundleFile, options);
  }

  // default content type
  if (options.response && !("contentType" in options)) options.contentType = CONTENT_TYPE_MAP.json;

  function concatPathMap() {
    return util.concatPathMap(options.pathMap, options)
      .then( output => {
        // if we know the dates of the individual files, add it to the results
        if (options.modified) {
          console.info("....Adding modififed dates to output");
          output.__modified = options.modified;
          output.__modified.__bundle = new Date();
        }

        return JSON.stringify(output, undefined, 2);
      });

  }
  return bundleThunk( concatPathMap, options);
}

// Bundle a bunch of files together.
export function bundlePaths(paths, options = {}) {
  if (!("debug" in options)) options.debug = DEBUG;

  if (options.debug) console.log("..bundlePaths()");
  if (!Array.isArray(paths)) throw new TypeError("bundle didn't specify a 'path' parameter");

  // normalize `paths` and `bundleFile`
  options.paths = paths.map(path => apiPaths.configPath(path, options));
  if (options.bundleFile) options.bundleFile = apiPaths.buildPath(options.bundleFile, options);

  // default delimiters & content type
  defaultOptionFromMap(options, "delimiter", DELIMITER_MAP);
  if (options.response) defaultOptionFromMap(options, "contentType", CONTENT_TYPE_MAP);

  return bundleThunk( () => util.concatPaths(options.paths, options), options);
}


// Return all the data we need to display a page
// `page` is a server `Page` object.
export function bundlePage({ page, force, response }) {
  const pathMap = {
    jsxe:    page.jsxePath,
    styles:  page.stylesPath,
    script:  page.scriptPath,
  };

  if (DEBUG) console.log(`bundlePage(${page.path})`);
  const options = {
    debug: DEBUG,
    force,
    response,
    bundleFile: page.bundlePath,
    optional: true,
    trusted: true,
  }
  return bundlePathMap(pathMap, options);
}

// Return all the data we need to display a section
export function bundleSection({ section, force, response }) {
  const pathMap = {
    jsxe:    section.jsxePath,
    styles:  section.stylesPath,
    script:  section.scriptPath,
    index:   section.indexPath
  };
  if (DEBUG) console.log(`bundleSection(${section.path})`);
  const options = {
    debug: DEBUG,
    force,
    response,
    bundleFile: section.bundlePath,
    optional: true,
    trusted: true,
  }
  return bundlePathMap(pathMap, options);
}

// Return all the data we need to display a project
export function bundleProject({ projectId, force, response }) {
  const projectPaths = new apiPaths.projectPaths(projectId);
  const pathMap = {
    jsxe:    projectPaths.jsxe,
    styles:  projectPaths.css,
    script:  projectPaths.script,
    index:   projectPaths.sectionIndex
  };

  const options = {
    debug: DEBUG,
    force,
    response,
    bundleFile: projectPaths.bundleFile,
    optional: true,
    trusted: true,
  }
  return bundlePathMap(pathMap, options);
}


//////////////////////////////
// Utility functions
//
//  You shouldn't need to call these, use the higher-level routines above if you can.
//////////////////////////////

// Given a `bundleThunk` that will bundle a bunch of stuff together,
//   - see if we actually need to do the bundling, and if so
//   - run the thunk and return the results.
// If you pass an express `response` object in the options,
export function bundleThunk(bundleThunk, options) {
  if (options.debug) console.log("....bundleThunk()");
  const {
    bundleFile,           // save results to this file, serve from that if up to date
    paths,                // we'll ensure `bundleFile` is newer than any of these files if both specified
    encoding = "utf8",    // encoding if we save files to bundleFile
    contentType,          // content type for successful response
    errorStatus = 500,    // error status for unsuccessful response
    errorMessage = "Error bundling files"
  } = options;

  return bundleIsUpToDate(bundleFile, paths, options)
    .then( useBundleFile => {
      const { response } = options;
      if (useBundleFile) {
        if (options.debug) console.log("....bundle is up to date, returning bundleFile");
        if (response) return response.sendFile(bundleFile);
        return fsp.readFile(bundleFile, encoding);
      }

      if (options.debug) console.log("....bundle is out of date, running bundleThunk");
      return bundleThunk()
        .then( results => {
          // if an bundleFile was specified, write the results but don't wait for it
          if (bundleFile) {
            console.log("......writing output to "+bundleFile);
            fsp.outputFile(bundleFile, results, encoding);
          }
          // send the results back
          if (response) {
            if (contentType) response.set("Content-Type", contentType);
            return response.send(results);
          }
          return results;
        });
    })
    .catch( (error) => {
      console.error(errorMessage + " :\n", error);
      if (response) {
        if (contentType) response.set("Content-Type", contentType);
        return response.status(errorStatus).send(errorMessage);
      }
      throw error;
    })
}


// Parse bundle JSON `inputFile` if specified, returning a promise
//  with the options from that file merged with the `options` passed in.
//
// If no `inputFile` specified, resolves() immediately with clone of the `options` passed in.
//
// NOTE: we assume that the input file is either an absolute path or a "config path"
//       and we DO NOT munge it with `options.basePath`.
function parseBundleInputFile(options) {
  const { inputFile, trusted = true } = options;
  if (options.debug) console.log("..parseBundleInputFile(", inputFile,")");

  // If no inputFile, return a clone of the options
  if (!inputFile) {
    if (options.debug) console.log("....no input file");
    return Promise.resolve(options);
  }

  // load inputFile
  if (options.debug) console.log("....loading input file");
  const path = apiPaths.configPath(inputFile, { trusted });
  return fsp.readJSON(path)
          .then( inputFileJSON => {
            if (inputFileJSON.debug === false && options.debug) {
              console.log("......input file turned off debugging, shhhhhhhhh.....");
            }
            // return it merged with the options passed in
            Object.assign(options, inputFileJSON);
            return options;
          });
}


// Returns a promise which yields true if the `buildFile` was last modified
//  AFTER all of the `sourceFiles`.
// Returns `false` if `buildFile` is not specified or doesn't exist.
// Ignores any `sourceFiles` which aren't found.
export function bundleIsUpToDate(bundleFile, sourceFiles, options = {}) {
  // bug out if we got unexpected inputs
  if ((bundleFile && typeof bundleFile !== "string") || !sourceFiles) {
    throw new TypeError("bundleIsUpToDate(): unexpected inputs");
  }

  if (options.debug) console.log("......bundleIsUpToDate()");
  const modifiedDates = [bundleFile, ...sourceFiles].map(util.lastModified);
  return Promise.all(modifiedDates)
    .then( ([bundleFileDate, ...sourceFileDates]) => {
      // remember the mod dates in the options for later
      options.bundleFileModified = bundleFileDate;
      options.latestModified = util.latestTimestamp(sourceFileDates);

      if (options.debug) console.log(`........bundleFile: ${bundleFile}`);
      if (options.debug) console.log("........bundle date:" + bundleFileDate);
      if (options.debug) console.log("........source date:" + options.latestModified);

      if (options.force) {
        if (options.debug) console.log("........forcing update because 'force' flag is set");
        options.bundleIsUpToDate = false;
      }
      else {
        options.bundleIsUpToDate
          = bundleFileDate && options.latestModified && bundleFileDate > options.latestModified;
      }

      // if options specifies keys, map the dates to those keys
      if (options.keys) {
        options.modified = {};
        sourceFileDates.forEach( (date, index) => options.modified[options.keys[index]] = date );
      }
      else {
        options.modified = sourceFileDates;
      }

      return options.bundleIsUpToDate;
    })
    .catch(error => {
      console.warn("ERROR getting bundle dates: ",error);
      throw error;
    })
}


//////////////////////////////
// Defaults
//////////////////////////////

function defaultOptionFromMap(options, key, DEFAULT_MAP) {
  if (! (key in options)) {
    const type = options.type;
    if (key in DEFAULT_MAP) options[key] = DEFAULT_MAP[key];
    else                    options[key] = DEFAULT_MAP["default"];
  }
}

const CONTENT_TYPE_MAP = {
  map:      "application/json",
  json:     "application/json",
  js:       "application/javascript",
  default:  "text/plain"
}

const DELIMITER_MAP = {
  js:       "\n\n/*** inlined from ${path} ***/\n\n",
  default:  "\n"
}


export default Object.assign({}, exports);

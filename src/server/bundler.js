//////////////////////////////
//
//  Oak "bundler"
//
//  "Bundle" a bunch of files together to send to the client in one swell foop.
//  Automatically checks mod-dates of constitutent files and re-bundles if necessary.
//
//////////////////////////////

import fse from "fs-extra";
import fsp from "fs-promise";
import fsPath from "path";

import objectUtil from "../oak-roots/util/object";

import apiPaths from "./paths";
import util from "./util";


// Set to `true` to output debug messages during bundling
export const DEBUG = false;

// "Clever" bundle routine:
//  - reads `options.inputFile` and adds that to the options
//  - normalizes `options.outputFile`, `options.paths`, and `options.pathMap`
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
// NOTE: paths in `pathMap` and `options.outputFile` should be full paths!
export function bundlePathMap(pathMap, options = {}) {
  if (!("debug" in options)) options.debug = DEBUG;

  if (options.debug) console.log("..bundlePathMap()\n", pathMap);
  if (!pathMap) throw new TypeError("map bundle didn't specify a 'pathMap'");

  // normalize `pathMap`
  options.pathMap = objectUtil.mapToObject(pathMap, (path, key) => apiPaths.configPath(path, options));
  options.keys = Object.keys(options.pathMap);
  options.paths = objectUtil.values(options.pathMap);

  // normalize outputFile
  if (options.outputFile) {
    options.outputFile = apiPaths.buildPath(options.outputFile, options);
  }

  // default content type
  if (options.response && !("contentType" in options)) options.contentType = CONTENT_TYPE_MAP.json;

  function concatPathMap() {
    return util.concatPathMap(options.pathMap, options)
      .then( output => {
        // if we know the dates of the individual files, add it to the results
        if (options.modified) {
          if (options.debug) console.info("....Adding modififed dates to output");
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
  if (!Array.isArray(paths)) throw new TypeError("bundlePaths didn't specify a 'path' parameter");

  // normalize `paths` and `outputFile`
  options.paths = paths.map(path => apiPaths.configPath(path, options));
  if (options.outputFile) options.outputFile = apiPaths.buildPath(options.outputFile, options);

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
    outputFile: page.bundlePath,
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
    index:   section.childIndexPath
  };
  if (DEBUG) console.log(`bundleSection(${section.path})`);
  const options = {
    debug: DEBUG,
    force,
    response,
    outputFile: section.bundlePath,
    optional: true,
    trusted: true,
  }
  return bundlePathMap(pathMap, options);
}


// Return all the data we need to display a project component.
export function bundleComponent({ component, force, response }) {
  const pathMap = {
    jsxe:    component.jsxePath,
    styles:  component.stylesPath,
    script:  component.scriptPath,
    index:   component.childIndexPath
  };
  if (DEBUG) console.log(`bundleProjectComponent(${component.path})`);
  const options = {
    debug: DEBUG,
    force,
    response,
    outputFile: component.bundlePath,
    optional: true,
    trusted: true,
  }
  return bundlePathMap(pathMap, options);
}


// Return all the data we need to display a project
export function bundleProject({ project, force, response }) {
  const pathMap = {
    jsxe:    project.jsxePath,
    styles:  project.stylesPath,
    script:  project.scriptPath,
    index:   project.childIndexPath
  };

  const options = {
    debug: DEBUG,
    force,
    response,
    outputFile: project.bundlePath,
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
    outputFile,           // save results to this file, serve from that if up to date
    paths,                // we'll ensure `outputFile` is newer than any of these files if both specified
    encoding = "utf8",    // encoding if we save files to outputFile
    contentType,          // content type for successful response
    errorStatus = 500,    // error status for unsuccessful response
    errorMessage = "Error bundling files"
  } = options;

  return bundleIsUpToDate(outputFile, paths, options)
    .then( useBundleFile => {
      const { response } = options;
      if (useBundleFile) {
        if (options.debug) console.log("....bundle is up to date, returning outputFile");
        if (response) return response.sendFile(outputFile);
        return fsp.readFile(outputFile, encoding);
      }

      if (options.debug) console.log("....bundle is out of date, running bundleThunk");
      return bundleThunk()
        .then( results => {
          // if an outputFile was specified, write the results but don't wait for it
          if (outputFile) {
            console.log("......writing output to "+outputFile);
            fsp.outputFile(outputFile, results, encoding);
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
export function parseBundleInputFile(options) {
  const { inputFile, trusted = true } = options;
  if (options.debug) console.log("..parseBundleInputFile(", inputFile,")");

  // If no inputFile, return a clone of the options
  if (!inputFile) {
    if (options.debug) console.log("....no input file");
    return Promise.resolve({ ...options });
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
            return {...options, ...inputFileJSON};
          });
}


// Returns a promise which yields true if the `buildFile` was last modified
//  AFTER all of the `sourceFiles`.
// Returns `false` if `buildFile` is not specified or doesn't exist.
// NOTE: Ignores any `sourceFiles` which aren't found.
// REFACTOR: This means that deleting a file will NOT update the bundle...
export function bundleIsUpToDate(outputFile, sourceFiles, options = {}) {
  // bug out if we got unexpected inputs
  if ((outputFile && typeof outputFile !== "string") || !sourceFiles) {
    throw new TypeError("bundleIsUpToDate(): unexpected inputs");
  }

  if (options.debug) console.log("......bundleIsUpToDate()");
  const modifiedDates = [outputFile, ...sourceFiles].map(util.lastModified);
  return Promise.all(modifiedDates)
    .then( ([outputFileDate, ...sourceFileDates]) => {
      // remember the mod dates in the options for later
      options.outputFileModified = outputFileDate;
      options.latestModified = util.latestTimestamp(sourceFileDates);

      if (options.debug) console.log(`........outputFile: ${outputFile}`);
      if (options.debug) console.log("........bundle date:" + outputFileDate);
      if (options.debug) console.log("........source date:" + options.latestModified);

      if (options.force) {
        if (options.debug) console.log("........forcing update because 'force' flag is set");
        options.bundleIsUpToDate = false;
      }
      else {
        options.bundleIsUpToDate
          = outputFileDate && options.latestModified && outputFileDate > options.latestModified;
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

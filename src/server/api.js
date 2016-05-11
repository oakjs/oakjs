//////////////////////////////
// API Routes
//////////////////////////////

import express from "express";
import bodyParser from "body-parser";
import fsp from "fs-promise";
import fsPath from "path";

import bundler from "./bundler";
import Page from "./Page";
import paths from "./paths";
import util from "./util";

const router = express.Router();
const bodyTextParser = bodyParser.text();


// Log every api request
router.use((request, response, next) => {
  console.log("\n==========================================================",
              "\n"+request.originalUrl,
              "\n----------------------------------------------------------");
  next()
});



//////////////////////////////
// Utility functions to load / save / etc
//////////////////////////////

function sendTextFile(request, response, path) {
  response.set("Content-Type", "text/plain");
  return response.sendFile(path);
}

function sendJSONFile(request, response, path) {
  response.set("Content-Type", "application/json");
  return response.sendFile(path);
}

function saveTextFile(request, response, path, body) {
  console.warn("Saving to ",path);
  console.warn(body);
  return fsp.outputFile(path, body)
    // echo the saved file back
    .then(result => sendTextFile(response, path));
}


function debugParams(query) {
  const { debug, force } = query;

  const options = {};
  if (debug !== undefined) options.debug = debug !== "false";
  if (force !== undefined) options.force = force !== "false";
  return options;
}


//////////////////////////////
// Projects index
//////////////////////////////


// Router for oak actions.
router.get("/oak/:action",  (request, response) => {
  const { action } = request.params;
  const appPaths = new paths.appPaths();
  switch (action) {
    case "projectIndex":   return sendJSONFile(request, response, appPaths.projectIndex);
  }
  throw new TypeError(`Projects API action ${action} not defined.`);
});


//////////////////////////////
// Page bits
//////////////////////////////

function _sendPageBundle(page, request, response) {
  return bundler.bundlePage({ page, response, ...debugParams(request.query) });
}

// Router for page read actions.
router.get("/page/:projectId/:sectionId/:pageId/:action",  (request, response) => {
  const { action, projectId, sectionId, pageId } = request.params;
  const page = new Page(projectId, sectionId, pageId);
  switch (action) {
    case "page":    return _sendPageBundle(page, request, response);
    case "jsxe":    return sendTextFile(request, response, page.jsxePath);
    case "script":  return sendTextFile(request, response, page.scriptPath);
    case "styles":  return sendTextFile(request, response, page.stylesPath);
  }
  throw new TypeError(`Page API action ${action} not defined.`);
});

// Router for page write actions.
// NOTE: these all assume the `body` is some form of plain text.
router.post("/page/:projectId/:sectionId/:pageId/:action", bodyTextParser, (request, response) => {
  const { action, projectId, sectionId, pageId } = request.params;
  const { body } = request;

  const page = new Page(projectId, sectionId, pageId);
  switch (action) {
    // save page bits as JSON blob:  { jsxe, script, styles }
    // returns the newly saved data
    case "save":    return page.save(JSON.parse(body))
                      .then( () => { return _sendPageBundle(page, request, response) })
  }
  throw new TypeError(`Page API action '${action}' not defined.`);
});


// Router for section read actions.
router.get("/section/:projectId/:sectionId/:action",  (request, response) => {
  const { action, projectId, sectionId } = request.params;

  const sectionPaths = new paths.sectionPaths(projectId, sectionId);
  switch (action) {
    case "section":     return bundler.bundleSection({ projectId, sectionId, response, ...debugParams(request.query) });
    case "jsxe":        return sendTextFile(request, response, sectionPaths.jsxe);
    case "script":      return sendTextFile(request, response, sectionPaths.script);
    case "styles":      return sendTextFile(request, response, sectionPaths.css);
    case "pageIndex":   return sendJSONFile(request, response, sectionPaths.pageIndex);
  }
  throw new TypeError(`Section API action '${action}' not defined.`);
});


// Router for project read actions.
router.get("/project/:projectId/:action",  (request, response) => {
  const { action, projectId } = request.params;

  const projectPaths = new paths.projectPaths(projectId);
  switch (action) {
    case "project":     return bundler.bundleProject({ projectId, response, ...debugParams(request.query) });
    case "jsxe":        return sendTextFile(request, response, projectPaths.jsxe);
    case "script":      return sendTextFile(request, response, projectPaths.script);
    case "styles":      return sendTextFile(request, response, projectPaths.css);
    case "sectionIndex":  return sendJSONFile(request, response, projectPaths.sectionIndex);
  }
  throw new TypeError(`Project API action '${action}' not defined.`);
});



//////////////////////////////
// Bundling
//////////////////////////////

router.get("/bundle", (request, response) => {
  const { debug, force, ...queryOptions } = request.query;

  const options = {
    errorStatus: 500,
    errorMessage: "Error bundling files",
    ...queryOptions,
    ...debugParams(request.query),
    response,
    trusted: false,
  };

  bundler.bundle(options)
    .catch(error => {
      console.error(options.errorMessage, ":\n", error);
      response.status(options.errorStatus).send(options.errorMessage);
    });
});





router.get("*", (request, response) => {
  throw new TypeError("API routine not defined.");
});


export default router;

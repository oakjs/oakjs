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
import Section from "./Section";
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
//  Page bits
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
  throw new TypeError(`Page GET API action ${action} not defined.`);
});

// Router for page write actions.
router.post("/page/:projectId/:sectionId/:pageId/:action", bodyTextParser, (request, response) => {
  const { action, projectId, sectionId, pageId } = request.params;
  const { body } = request;

  const page = new Page(projectId, sectionId, pageId);
  switch (action) {
    // save page bits as JSON blob:  { jsxe, script, styles }
    // returns the newly saved data
    case "save":      const pageData = JSON.parse(body);
                      return page.save(pageData)
                        .then( () => _sendPageBundle(page, request, response) );

    case "create":    const createData = JSON.parse(body);
                      return page.create(createData)
                        .then( () => _sendPageBundle(page, request, response) );

    // Change the id of the page, updating the section index.s
    case "changeId":  const params = JSON.parse(body);
                      return page.changeId(params.toId)
                        .then( () => sendJSONFile(request, response, page.section.indexPath) );
  }
  throw new TypeError(`Page POST API action '${action}' not defined.`);
});



//////////////////////////////
//  Section bits
//////////////////////////////

function _sendSectionBundle(section, request, response) {
  return bundler.bundleSection({ section, response, ...debugParams(request.query) });
}

// Router for section read actions.
router.get("/section/:projectId/:sectionId/:action",  (request, response) => {
  const { action, projectId, sectionId } = request.params;
  const section = new Section(projectId, sectionId);
  switch (action) {
    case "section":     return _sendSectionBundle(section, request, response);
    case "jsxe":        return sendTextFile(request, response, section.jsxePath);
    case "script":      return sendTextFile(request, response, section.scriptPath);
    case "styles":      return sendTextFile(request, response, section.stylesPath);
    case "pageIndex":   return sendJSONFile(request, response, section.indexPath);
  }
  throw new TypeError(`Section GET API action '${action}' not defined.`);
});

// Router for page write actions.
router.post("/section/:projectId/:sectionId/:action", bodyTextParser, (request, response) => {
  const { action, projectId, sectionId } = request.params;
  const { body } = request;

  const section = new Section(projectId, sectionId);
  switch (action) {
    // save section bits as JSON blob:  { jsxe, script, styles, index }
    // returns the newly saved data
    case "save":      const sectionData = JSON.parse(body);
                      return section.save(sectionData)
                        .then( () => _sendSectionBundle(section, request, response) );

    case "changeId":  const params = JSON.parse(body);
                      return section.changeId(params.toId)
                        .then( () => sendJSONFile(request, response, section.section.indexPath) );
  }
  throw new TypeError(`Sectoin POST API action '${action}' not defined.`);
});


//////////////////////////////
//  Project bits
//////////////////////////////


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
  throw new TypeError(`Project GET API action '${action}' not defined.`);
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

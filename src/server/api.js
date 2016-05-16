//////////////////////////////
// API Routes
//////////////////////////////

import express from "express";
import bodyParser from "body-parser";
import fsp from "fs-promise";
import fsPath from "path";

import bundler from "./bundler";
import Page from "./Page";
import Project from "./Project";
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


// Generic error handling
router.use((error, request, response, next) => {
  if (error instanceof Error) console.trace(error);
  else console.error("ERROR: " + message);
  res.status(500).send(error);
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
//  Oak actions
//////////////////////////////

router.get("/oak/:action",  (request, response) => {
  const { action } = request.params;
  const appPaths = new paths.appPaths();
  switch (action) {
    case "projects":   return sendJSONFile(request, response, appPaths.projectIndex);
  }
  throw new TypeError(`Oak API action ${action} not defined.`);
});


//////////////////////////////
//  Page actions
//////////////////////////////

// Merge page bundle with section pageIndex and return both
function _sendPageBundleAndSectionPageIndex(page, request, response) {
  return Promise.all([
            bundler.bundlePage({ page }),
            page.section.getChildIndex()
          ])
          .then( ([ bundleJSON, indexJSON ]) => {
            // convert to objects and merge
            const bundle = JSON.parse(bundleJSON);
            bundle.pageIndex = JSON.parse(indexJSON);
            // send the whole shmear back
            response.send(bundle);
         });
}


// Page read actions.
router.get("/page/:projectId/:sectionId/:pageId/:action",  (request, response) => {
  const { action, projectId, sectionId, pageId } = request.params;
  const page = new Page({ projectId, sectionId, pageId });
  switch (action) {
    case "bundle":  return page.getBundle(response, request.query.force !== "true");
    case "jsxe":    return page.getJSXE(response);
    case "script":  return page.getScript(response);
    case "styles":  return page.getStyles(response);
  }
  throw new TypeError(`Page GET API action ${action} not defined.`);
});

// Page write actions.
router.post("/page/:projectId/:sectionId/:pageId/:action", bodyTextParser, (request, response) => {
  const { action, projectId, sectionId, pageId } = request.params;
  const { body } = request;
  const data = body ? JSON.parse(body) : {};

  const page = new Page({ projectId, sectionId, pageId });
  switch (action) {
    case "save":      return page.save(data)
                        .then( () => page.getBundle(response) )
                        .catch( error => { console.error(error); throw new Error(error)} );

    case "create":    return page.create(data)
                        .then( () => page.getBundleAndParentIndex(response) )
                        .catch( error => { console.error(error); throw new Error(error)} );

    case "duplicate": return page.duplicate(data)
                        .then( newPage => newPage.getBundleAndParentIndex(response) )
                        .catch( error => { console.error(error); throw new Error(error)} );

    case "rename":    return page.changeId(data.newId)
                        .then( newPage => newPage.section.getChildIndex(response) )
                        .catch( error => { console.error(error); throw new Error(error)} );

    case "delete":    return page.delete()
                        .then( () => page.section.getChildIndex(response) )
                        .catch( error => { console.error(error); throw new Error(error)} );

    case "undelete":  return page.undelete(data)
                        .then( () => page.getBundleAndParentIndex(response) )
                        .catch( error => { console.error(error); throw new Error(error)} );
  }
  throw new TypeError(`Page POST API action '${action}' not defined.`);
});



//////////////////////////////
//  Section actions
//////////////////////////////

// Section read actions.
router.get("/section/:projectId/:sectionId/:action",  (request, response) => {
  const { action, projectId, sectionId } = request.params;
  const section = new Section({ projectId, sectionId });
  switch (action) {
    case "bundle":  return section.getBundle(response, request.query.force !== "true");
    case "jsxe":    return section.getJSXE(response);
    case "script":  return section.getScript(response);
    case "styles":  return section.getStyles(response);
    case "pages":   return section.getChildIndex(response);
  }
  throw new TypeError(`Section GET API action '${action}' not defined.`);
});

// Section write actions.
router.post("/section/:projectId/:sectionId/:action", bodyTextParser, (request, response) => {
  const { action, projectId, sectionId } = request.params;
  const { body } = request;
  const data = body ? JSON.parse(body) : {};

  const section = new Section({ projectId, sectionId });
  switch (action) {
    case "save":      return section.save(data)
                        .then( () => section.getBundle(response) )
                        .catch( error => { console.error(error); throw new Error(error)} );

    case "create":    return section.create(data)
                        .then( () => section.getBundleAndParentIndex(response) )
                        .catch( error => { console.error(error); throw new Error(error)} );

    case "duplicate": return section.duplicate(data)
                        .then( newSection => newSection.getBundleAndParentIndex(response) )
                        .catch( error => { console.error(error); throw new Error(error)} );

    case "rename":    return section.changeId(data.newId)
                        .then( newSection => newSection.project.getChildIndex(response) )
                        .catch( error => { console.error(error); throw new Error(error)} );

    case "delete":    return section.delete()
                        .then( () => section.project.getChildIndex(response) )
                        .catch( error => { console.error(error); throw new Error(error)} );

    case "undelete":  return section.undelete(data)
                        .then( () => section.getBundleAndParentIndex(response) )
                        .catch( error => { console.error(error); throw new Error(error)} );
  }
  throw new TypeError(`Sectoin POST API action '${action}' not defined.`);
});


//////////////////////////////
//  Project actions
//////////////////////////////

router.get("/project/:projectId/:action",  (request, response) => {
  const { action, projectId } = request.params;
  const project = new Project({ projectId });
  switch (action) {
    case "bundle":  return project.getBundle(response, request.query.force !== "true");
    case "jsxe":    return project.getJSXE(response);
    case "script":  return project.getScript(response);
    case "styles":  return project.getStyles(response);
    case "sections":   return project.getChildIndex(response);
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
      response
        .status(options.errorStatus)
        .send(options.errorMessage);
    });
});





router.get("*", (request, response) => {
  throw new TypeError("API routine not defined.");
});


export default router;

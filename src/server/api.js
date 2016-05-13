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
            page.section.getIndex()
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
  const page = new Page(projectId, sectionId, pageId);
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

  const page = new Page(projectId, sectionId, pageId);
  switch (action) {
    case "save":      const pageData = JSON.parse(body);
                      return page.save(pageData)
                        .then( () => page.getBundle(response) );

    case "create":    const createData = JSON.parse(body);
                      return page.create(createData)
                        .then( () => page.getBundleAndPageIndex(response) )

    case "delete":    return page.delete()
                        .then( () => page.section.getIndex(response) );

    case "changeId":  const params = JSON.parse(body);
                      return page.changeId(params.toId)
                        .then( () => page.section.getIndex(response) );
  }
  throw new TypeError(`Page POST API action '${action}' not defined.`);
});



//////////////////////////////
//  Section actions
//////////////////////////////

// Section read actions.
router.get("/section/:projectId/:sectionId/:action",  (request, response) => {
  const { action, projectId, sectionId } = request.params;
  const section = new Section(projectId, sectionId);
  switch (action) {
    case "bundle":  return section.getBundle(response, request.query.force !== "true");
    case "jsxe":    return section.getJSXE(response);
    case "script":  return section.getScript(response);
    case "styles":  return section.getStyles(response);
    case "pages":   return section.getIndex(response);
  }
  throw new TypeError(`Section GET API action '${action}' not defined.`);
});

// Section write actions.
router.post("/section/:projectId/:sectionId/:action", bodyTextParser, (request, response) => {
  const { action, projectId, sectionId } = request.params;
  const { body } = request;

  const section = new Section(projectId, sectionId);
  switch (action) {
    case "save":      const sectionData = JSON.parse(body);
                      return section.save(sectionData)
                        .then( () => section.getBundle(response) );

    case "create":    const createData = JSON.parse(body);
                      return section.create(createData)
                        .then( () => section.getBundleAndSectionIndex(response) )

    case "delete":    return section.delete()
                        .then( () => section.project.getIndex(response) );

    case "changeId":  const params = JSON.parse(body);
                      return section.changeId(params.toId)
                        .then( () => section.project.getIndex(response) );
  }
  throw new TypeError(`Sectoin POST API action '${action}' not defined.`);
});


//////////////////////////////
//  Project actions
//////////////////////////////

router.get("/project/:projectId/:action",  (request, response) => {
  const { action, projectId } = request.params;

  const projectPaths = new paths.projectPaths(projectId);
  switch (action) {
    case "bundle":      return bundler.bundleProject({ projectId, response, ...debugParams(request.query) });
    case "jsxe":        return sendTextFile(request, response, projectPaths.jsxe);
    case "script":      return sendTextFile(request, response, projectPaths.script);
    case "styles":      return sendTextFile(request, response, projectPaths.css);
    case "sections":    return sendJSONFile(request, response, projectPaths.sectionIndex);

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

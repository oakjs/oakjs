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
import ProjectComponent from "./ProjectComponent";
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


//////////////////////////////
//  Generic `Component` class actions.
//  All assume you pass in an instance of the server `Component` or subclass.
//////////////////////////////

// Handle GET request action for a component.
function handleComponentGetAction(action, component, request, response) {
  switch (action) {
    case "bundle":  return component.getBundle(response, request.query.force === "true");
    case "jsxe":    return component.getJSXE(response);
    case "script":  return component.getScript(response);
    case "styles":  return component.getStyles(response);
    case "index":   return component.getChildIndex(response);
    case "compile": return component.getCompiled(response);
  }
  throw new TypeError(`${component.type} GET API action '${action}' not defined.`);
}



// Handle POST request action for a component.
function handleComponentPostAction(action, component, request, response) {
  const { body } = request;
  const data = body ? JSON.parse(body) : {};
  switch (action) {
    case "save":      return component.save(data)
                        .then( () => component.getBundle(response) )
                        .catch( error => { console.error(error); throw new Error(error)} );

    case "create":    return component.create(data)
                        .then( () => component.getBundleAndParentIndex(response) )
                        .catch( error => { console.error(error); throw new Error(error)} );

    case "duplicate": return component.duplicate(data)
                        .then( newComponent => newComponent.getBundleAndParentIndex(response) )
                        .catch( error => { console.error(error); throw new Error(error)} );

    case "rename":    return component.changeId(data)
                        .then( newComponent => newComponent.parentIndex.getFile(response) )
                        .catch( error => { console.error(error); throw new Error(error)} );

    case "delete":    return component.delete()
                        .then( () => component.parentIndex.getFile(response) )
                        .catch( error => { console.error(error); throw new Error(error)} );

    case "undelete":  return component.undelete(data)
                        .then( () => component.getBundleAndParentIndex(response) )
                        .catch( error => { console.error(error); throw new Error(error)} );
  }
  throw new TypeError(`Project POST API action '${action}' not defined.`);
}


//////////////////////////////
//  Account actions
//////////////////////////////

router.get("/oak/account/:action",  (request, response) => {
  const { action } = request.params;
  const account = new paths.Account();
  switch (action) {
    case "index":   return sendJSONFile(request, response, account.projectIndexPath);
  }
  throw new TypeError(`Account API action ${action} not defined.`);
});



//////////////////////////////
//  Page actions
//////////////////////////////

// Page read actions.
router.get("/oak/page/:action/:projectId/:sectionId/:pageId",  (request, response) => {
  const { action, projectId, sectionId, pageId } = request.params;
  const page = new Page({ projectId, sectionId, pageId });
  return handleComponentGetAction(action, page, request, response);
});

// Page write actions.
router.post("/oak/page/:action/:projectId/:sectionId/:pageId", bodyTextParser, (request, response) => {
  const { action, projectId, sectionId, pageId } = request.params;
  const page = new Page({ projectId, sectionId, pageId });
  return handleComponentPostAction(action, page, request, response);
});



//////////////////////////////
//  Section actions
//////////////////////////////

// Section read actions.
router.get("/oak/section/:action/:projectId/:sectionId",  (request, response) => {
  const { action, projectId, sectionId } = request.params;
  const section = new Section({ projectId, sectionId });
  return handleComponentGetAction(action, section, request, response);
});

// Section write actions.
router.post("/oak/section/:action/:projectId/:sectionId", bodyTextParser, (request, response) => {
  const { action, projectId, sectionId } = request.params;
  const section = new Section({ projectId, sectionId });
  return handleComponentPostAction(action, section, request, response);
});


//////////////////////////////
//  Project actions
//////////////////////////////

// Project read actions.
router.get("/oak/project/:action/:projectId",  (request, response) => {
  const { action, projectId } = request.params;
  const project = new Project({ projectId });
  return handleComponentGetAction(action, project, request, response);
});

// Project write actions.
router.post("/oak/project/:action/:projectId", bodyTextParser, (request, response) => {
  const { action, projectId } = request.params;
  const project = new Project({ projectId });
  return handleComponentPostAction(action, project, request, response);
});


//////////////////////////////
//  Component actions
//////////////////////////////
router.get("/oak/component/:action/:projectId/:componentId",  (request, response) => {
  const { action, projectId, componentId } = request.params;
  const component = new ProjectComponent({ projectId, componentId });
  return handleComponentGetAction(action, component, request, response);
});


// Project write actions.
router.post("/oak/component/:action/:projectId/:componentId", bodyTextParser, (request, response) => {
  const { action, projectId, componentId } = request.params;
  const component = new ProjectComponent({ projectId, componentId });
  return handleComponentPostAction(action, component, request, response);
});


//////////////////////////////
// Bundling
//////////////////////////////

router.get("/oak/bundle", (request, response) => {
  const { debug, force, ...queryOptions } = request.query;

  const options = {
    errorStatus: 500,
    errorMessage: "Error bundling files",
    ...queryOptions,
    debug: debug === "true",
    force: force === "true",
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

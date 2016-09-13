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
//  Account actions
//////////////////////////////

router.get("/account/:action",  (request, response) => {
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
router.get("/page/:action/:projectId/:sectionId/:pageId",  (request, response) => {
  const { action, projectId, sectionId, pageId } = request.params;
  const page = new Page({ projectId, sectionId, pageId });
  switch (action) {
    case "bundle":  return page.getBundle(response, request.query.force === "true");
    case "jsxe":    return page.getJSXE(response);
    case "script":  return page.getScript(response);
    case "styles":  return page.getStyles(response);
  }
  throw new TypeError(`Page GET API action ${action} not defined.`);
});

// Page write actions.
router.post("/page/:action/:projectId/:sectionId/:pageId", bodyTextParser, (request, response) => {
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

    case "rename":    return page.changeId(data)
                        .then( newPage => newPage.parentIndex.getFile(response) )
                        .catch( error => { console.error(error); throw new Error(error)} );

    case "delete":    return page.delete()
                        .then( () => page.parentIndex.getFile(response) )
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
router.get("/section/:action/:projectId/:sectionId",  (request, response) => {
  const { action, projectId, sectionId } = request.params;
  const section = new Section({ projectId, sectionId });
  switch (action) {
    case "bundle":  return section.getBundle(response, request.query.force === "true");
    case "jsxe":    return section.getJSXE(response);
    case "script":  return section.getScript(response);
    case "styles":  return section.getStyles(response);
    case "index":   return section.getChildIndex(response);
  }
  throw new TypeError(`Section GET API action '${action}' not defined.`);
});

// Section write actions.
router.post("/section/:action/:projectId/:sectionId", bodyTextParser, (request, response) => {
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

    case "rename":    return section.changeId(data)
                        .then( newSection => newSection.parentIndex.getFile(response) )
                        .catch( error => { console.error(error); throw new Error(error)} );

    case "delete":    return section.delete()
                        .then( () => section.parentIndex.getFile(response) )
                        .catch( error => { console.error(error); throw new Error(error)} );

    case "undelete":  return section.undelete(data)
                        .then( () => section.getBundleAndParentIndex(response) )
                        .catch( error => { console.error(error); throw new Error(error)} );
  }
  throw new TypeError(`Section POST API action '${action}' not defined.`);
});


//////////////////////////////
//  Project actions
//////////////////////////////

// Project read actions.
router.get("/project/:action/:projectId",  (request, response) => {
  const { action, projectId } = request.params;
  const project = new Project({ projectId });
  switch (action) {
    case "bundle":  return project.getBundle(response, request.query.force === "true");
    case "jsxe":    return project.getJSXE(response);
    case "script":  return project.getScript(response);
    case "styles":  return project.getStyles(response);
    case "index":   return project.getChildIndex(response);
  }
  throw new TypeError(`Project GET API action '${action}' not defined.`);
});

// Project write actions.
router.post("/project/:action/:projectId", bodyTextParser, (request, response) => {
  const { action, projectId } = request.params;
  const { body } = request;
  const data = body ? JSON.parse(body) : {};
  const project = new Project({ projectId });
  switch (action) {
    case "save":      return project.save(data)
                        .then( () => project.getBundle(response) )
                        .catch( error => { console.error(error); throw new Error(error)} );

    case "create":    return project.create(data)
                        .then( () => project.getBundleAndParentIndex(response) )
                        .catch( error => { console.error(error); throw new Error(error)} );

    case "duplicate": return project.duplicate(data)
                        .then( newProject => newProject.getBundleAndParentIndex(response) )
                        .catch( error => { console.error(error); throw new Error(error)} );

    case "rename":    return project.changeId(data)
                        .then( newProject => newProject.parentIndex.getFile(response) )
                        .catch( error => { console.error(error); throw new Error(error)} );

    case "delete":    return project.delete()
                        .then( () => project.parentIndex.getFile(response) )
                        .catch( error => { console.error(error); throw new Error(error)} );

    case "undelete":  return project.undelete(data)
                        .then( () => project.getBundleAndParentIndex(response) )
                        .catch( error => { console.error(error); throw new Error(error)} );
  }
  throw new TypeError(`Project POST API action '${action}' not defined.`);
});


//////////////////////////////
//  Component actions
//////////////////////////////
router.get("/component/:action/:projectId/:componentId",  (request, response) => {
  const { action, projectId, componentId } = request.params;
// UGH... don't want to have to create a Component subclass for each variant...
  const component = new ProjectComponent({ projectId, componentId });
  switch (action) {
    case "bundle":  return component.getBundle(response, request.query.force === "true");
    case "jsxe":    return component.getJSXE(response);
    case "script":  return component.getScript(response);
    case "styles":  return component.getStyles(response);
    case "index":   return component.getChildIndex(response);
  }
  throw new TypeError(`Project GET API action '${action}' not defined.`);
});


// Project write actions.
router.post("/component/:action/:projectId/:componentId", bodyTextParser, (request, response) => {
  const { action, projectId, componentId } = request.params;
  const { body } = request;
  const data = body ? JSON.parse(body) : {};
  const component = new ProjectComponent({ projectId, componentId });
  switch (action) {
    case "save":      return component.save(data)
                        .then( () => component.getBundle(response) )
                        .catch( error => { console.error(error); throw new Error(error)} );

    case "create":    return component.create(data)
                        .then( () => component.getBundleAndParentIndex(response) )
                        .catch( error => { console.error(error); throw new Error(error)} );

    case "duplicate": return component.duplicate(data)
                        .then( newProject => newProject.getBundleAndParentIndex(response) )
                        .catch( error => { console.error(error); throw new Error(error)} );

    case "rename":    return component.changeId(data)
                        .then( newProject => newProject.parentIndex.getFile(response) )
                        .catch( error => { console.error(error); throw new Error(error)} );

    case "delete":    return component.delete()
                        .then( () => component.parentIndex.getFile(response) )
                        .catch( error => { console.error(error); throw new Error(error)} );

    case "undelete":  return component.undelete(data)
                        .then( () => component.getBundleAndParentIndex(response) )
                        .catch( error => { console.error(error); throw new Error(error)} );
  }
  throw new TypeError(`Project Component POST API action '${action}' not defined.`);
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

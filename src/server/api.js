//////////////////////////////
// API Routes
//////////////////////////////

import express from "express";
import bodyParser from "body-parser";
import fsp from "fs-promise";
import fsPath from "path";

import bundler from "./bundler";
import apiPaths from "./paths";
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


//////////////////////////////
// Projects index
//////////////////////////////


// Router for app actions.
router.get("/app/:action",  (request, response) => {
  const { action } = request.params;
  const appPaths = new apiPaths.appPaths();
  switch (action) {
    case "projects":   return sendJSONFile(request, response, appPaths.projectIndex);
  }
  throw new TypeError(`Projects API action ${action} not defined.`);
});


//////////////////////////////
// Card bits
//////////////////////////////


// Router for card read actions.
router.get("/card/:projectId/:stackId/:cardId/:action",  (request, response) => {
  const { action, projectId, stackId, cardId } = request.params;
  const { force = false } = request.query;
  const cardPaths = new apiPaths.cardPaths(projectId, stackId, cardId);
  switch (action) {
    case "jsxe":    return sendTextFile(request, response, cardPaths.jsxe);
    case "script":  return sendTextFile(request, response, cardPaths.script);
    case "styles":  return sendTextFile(request, response, cardPaths.css);
    case "bundle":  return bundler.bundleCard({ projectId, stackId, cardId, force, response });
  }
  throw new TypeError(`Card API action ${action} not defined.`);
});

// Router for card write actions.
// NOTE: these all assume the `body` is plain text.
router.post("/card/:projectId/:stackId/:cardId/:action", bodyTextParser, (request, response) => {
  const { action, projectId, stackId, cardId } = request.params;
  const cardPaths = new apiPaths.cardPaths(projectId, stackId, cardId);
  const { body } = request;
  switch (action) {
    case "jsxe":    return saveTextFile(request, response, cardPaths.jsxe, body);
    case "script":  return saveTextFile(request, response, cardPaths.script, body);
    case "styles":  return saveTextFile(request, response, cardPaths.css, body);
  }
  throw new TypeError(`Card API action '${action}' not defined.`);
});


// Router for stackId read actions.
router.get("/stack/:projectId/:stackId/:action",  (request, response) => {
  const { action, projectId, stackId } = request.params;
  const { force = false } = request.query;
  const stackPaths = new apiPaths.stackPaths(projectId, stackId);
  switch (action) {
    case "jsxe":    return sendTextFile(request, response, stackPaths.jsxe);
    case "script":  return sendTextFile(request, response, stackPaths.script);
    case "styles":  return sendTextFile(request, response, stackPaths.css);
    case "cards":   return sendJSONFile(request, response, stackPaths.cardIndex);
    case "bundle":  return bundler.bundleStack({ projectId, stackId, force, response });
  }
  throw new TypeError(`Stack API action '${action}' not defined.`);
});


// Router for projectId read actions.
router.get("/project/:projectId/:action",  (request, response) => {
  const { action, projectId } = request.params;
  const { force = false } = request.query;
  const projectPaths = new apiPaths.projectPaths(projectId);
  switch (action) {
    case "jsxe":    return sendTextFile(request, response, projectPaths.jsxe);
    case "script":  return sendTextFile(request, response, projectPaths.script);
    case "styles":  return sendTextFile(request, response, projectPaths.css);
    case "stacks":  return sendJSONFile(request, response, projectPaths.stackIndex);
    case "bundle":  return bundler.bundleProject({ projectId, force, response });
  }
  throw new TypeError(`Project API action '${action}' not defined.`);
});



//////////////////////////////
// Bundling
//////////////////////////////

router.get("/bundle", (request, response) => {
  if (bundler.DEBUG) console.log("=============================\n", request.originalUrl,"\n-----------------------------");
  if (bundler.DEBUG) console.log("query options: ", request.query);

  const options = {
    errorStatus: 500,
    errorMessage: "Error bundling files",
    ...request.query,
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

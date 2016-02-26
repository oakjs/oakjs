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


// Router for card read actions.
router.get("/projects/:action",  (request, response) => {
  const { action } = request.params;
  switch (action) {
    case "index":   return sendJSONFile(request, response, apiPaths.projectsPath("index.json"));
  }
  throw new TypeError(`Projects API action ${action} not defined.`);
});


//////////////////////////////
// Card bits
//////////////////////////////


// Router for card read actions.
router.get("/card/:projectId/:stackId/:cardId/:action",  (request, response) => {
  const { action, projectId, stackId, cardId } = request.params;
  const card = new apiPaths.card(projectId, stackId, cardId);
  switch (action) {
    case "jsxe":    return sendTextFile(request, response, card.jsxePath);
    case "css":     return sendTextFile(request, response, card.cssPath);
    case "script":  return sendTextFile(request, response, card.scriptPath);
    case "bundle":  return bundler.bundleCard({ projectId, stackId, cardId, response });
  }
  throw new TypeError(`Card API action ${action} not defined.`);
});

// Router for card write actions.
// NOTE: these all assume the `body` is plain text.
router.post("/card/:projectId/:stackId/:cardId/:action", bodyTextParser, (request, response) => {
  const { action, projectId, stackId, cardId } = request.params;
  const card = new apiPaths.card(projectId, stackId, cardId);
  const { body } = request;
  switch (action) {
    case "jsxe":    return saveTextFile(request, response, card.jsxePath, body);
    case "css":     return saveTextFile(request, response, card.cssPath, body);
    case "script":  return saveTextFile(request, response, card.scriptPath, body);
  }
  throw new TypeError(`Card API action '${action}' not defined.`);
});


// Router for stackId read actions.
router.get("/stack/:projectId/:stackId/:action",  (request, response) => {
  const { action, projectId, stackId } = request.params;
  const stack = new apiPaths.stack(projectId, stackId);
  switch (action) {
    case "jsxe":    return sendTextFile(request, response, stack.jsxePath);
    case "css":     return sendTextFile(request, response, stack.cssPath);
    case "script":  return sendTextFile(request, response, stack.scriptPath);
    case "index":   return sendJSONFile(request, response, stack.cardIndexPath);
    case "bundle":  return bundler.bundleStack({ projectId, stackId, response });
  }
  throw new TypeError(`Stack API action '${action}' not defined.`);
});


// Router for projectId read actions.
router.get("/project/:projectId/:action",  (request, response) => {
  const { action, projectId } = request.params;
  const project = new apiPaths.project(projectId);
  switch (action) {
    case "jsxe":    return sendTextFile(request, response, project.jsxePath);
    case "css":     return sendTextFile(request, response, project.cssPath);
    case "script":  return sendTextFile(request, response, project.scriptPath);
    case "index":   return sendJSONFile(request, response, project.cardIndexPath);
    case "bundle":  return bundler.bundleProject({ projectId, response });
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

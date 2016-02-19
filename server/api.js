//////////////////////////////
// API Routes
//////////////////////////////

import express from "express";
import bodyParser from "body-parser";
import fs from "fs-promise";

import paths from "./paths";

const router = express.Router();
const bodyTextParser = bodyParser.text();



//////////////////////////////
// Utility functions to load / save / etc
//////////////////////////////

function sendTextFile(response, path) {
  response.set("Content-Type", "text/plain");
  return response.sendFile(path);
}

function saveTextFile(response, path, body) {
  console.warn("Saving to ",path);
  console.warn(body);
  return fs.outputFile(path, body)
    // echo the saved file back
    .then(result => sendTextFile(response, path));
}


//////////////////////////////
// Card bits
//////////////////////////////


// Router for card read actions.
router.get("/card/:project/:stack/:card/:action",  (request, response) => {
  const { action, project, stack, card } = request.params;
  switch (action) {
    case "jsxe":    return sendTextFile(response, paths.cardPath(project, stack, card, ".jsxe"));
    case "css":     return sendTextFile(response, paths.cardPath(project, stack, card, ".css"));
    case "script":  return sendTextFile(response, paths.cardPath(project, stack, card, ".js"));
  }
  throw new TypeError(`Card API action ${action} not defined.`);
});

// Router for card write actions.
// NOTE: these all assume the `body` is plain text.
router.post("/card/:project/:stack/:card/:action", bodyTextParser, (request, response) => {
  const { action, project, stack, card } = request.params;
  const { body } = request;
  switch (action) {
    case "jsxe":    return saveTextFile(response, paths.cardPath(project, stack, card, ".jsxe"), body);
    case "css":     return saveTextFile(response, paths.cardPath(project, stack, card, ".css"), body);
    case "script":  return saveTextFile(response, paths.cardPath(project, stack, card, ".js"), body);
  }
  throw new TypeError(`Card API action ${action} not defined.`);
});


// Router for stack read actions.
router.get("/stack/:project/:stack/:action",  (request, response) => {
  const { action, project, stack } = request.params;
  switch (action) {
    case "jsxe":    return sendTextFile(response, paths.stackPath(project, stack, "stack.jsxe"));
    case "css":     return sendTextFile(response, paths.stackPath(project, stack, "stack.css"));
    case "script":  return sendTextFile(response, paths.stackPath(project, stack, "stack.js"));
    case "index":   return sendTextFile(response, paths.stackPath(project, stack, "cards.json"));
  }
  throw new TypeError(`Stack API action ${action} not defined.`);
});


// Router for project read actions.
router.get("/project/:project/:action",  (request, response) => {
  const { action, project } = request.params;
  switch (action) {
    case "jsxe":    return sendTextFile(response, paths.projectPath(project, "project.jsxe"));
    case "css":     return sendTextFile(response, paths.projectPath(project, "project.css"));
    case "script":  return sendTextFile(response, paths.projectPath(project, "project.js"));
    case "index":   return sendTextFile(response, paths.projectPath(project, "stacks.json"));
  }
  throw new TypeError(`Project API action ${action} not defined.`);
});



router.get("*", (request, response) => {
  throw new TypeError("API routine not defined.");
});


export default router;

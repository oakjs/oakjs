//////////////////////////////
// API Routes
//////////////////////////////

import express from "express";

import paths from "./paths";

const router = express.Router();


// Return component JSX file for a card, stack or project
router.get("/jsxe/:project/:stack?/:card?",  (request, response) => {
  response.set("Content-Type", "text/plain");
  const { project, stack, card } = request.params;
  if (card) return response.sendFile(paths.cardPath(project, stack, card, ".jsxe"));
  if (stack) return response.sendFile(paths.stackPath(project, stack, "stack.jsxe"));
  if (project) return response.sendFile(paths.projectPath(project, "project.jsxe"));
});

// Return CSS file for a card, stack or project
router.get("/css/:project/:stack?/:card?",  (request, response) => {
  response.set("Content-Type", "text/plain");
  const { project, stack, card } = request.params;
  if (card) return response.sendFile(paths.cardPath(project, stack, card, ".css"));
  if (stack) return response.sendFile(paths.stackPath(project, stack, "stack.css"));
  if (project) return response.sendFile(paths.projectPath(project, "project.css"));
});

// Return script file for a card, stack or project
router.get("/script/:project/:stack?/:card?",  (request, response) => {
  response.set("Content-Type", "text/plain");
  const { project, stack, card } = request.params;
  if (card) return response.sendFile(paths.cardPath(project, stack, card, ".js"));
  if (stack) return response.sendFile(paths.stackPath(project, stack, "stack.js"));
  if (project) return response.sendFile(paths.projectPath(project, "project.js"));
});


router.get("*", (request, response) => {
  throw new TypeError("API routine not defined.");
});


export default router;

//////////////////////////////
// API Routes
//////////////////////////////

import express from "express";

import paths from "./paths";

const router = express.Router();


// Return component JSX file for a card, stack or project
router.get("/jsx/:project/:stack?/:card?",  (request, response) => {
  response.set("Content-Type", "text/plain");
  const { project, stack, card } = request.params;
  if (card) return response.sendFile(paths.cardPath(project, stack, card, ".jsx"));
  if (stack) return response.sendFile(paths.stackPath(project, stack, "stack.jsx"));
  if (project) return response.sendFile(paths.projectPath(project, "project.jsx"));
});

// Return CSS file for a card, stack or project
router.get("/css/:project/:stack?/:card?",  (request, response) => {
  response.set("Content-Type", "text/plain");
  const { project, stack, card } = request.params;
  if (card) return response.sendFile(paths.cardPath(project, stack, card, ".css"));
  if (stack) return response.sendFile(paths.stackPath(project, stack, "stack.css"));
  if (project) return response.sendFile(paths.projectPath(project, "project.css"));
});


router.get("*", (request, response) => {
  throw new TypeError("API routine not defined.");
});


export default router;

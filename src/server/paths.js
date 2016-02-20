//////////////////////////////
// Server-side project managment class
// NOTE: instantiating a project is really lightweight
//       so you can do so dynamically when servicing requests.
//////////////////////////////

import fsPath from "path";
import config from './config';

//////////////////////////////
//  Path utilities
//////////////////////////////

export function isValidPath(path) {
  if (path.includes("//")) return false;
  return path.split("/").every(segment => segment !== "." && segment !== "..");
}

// Return the path for a project file.
// Default is to return the `project.jsx` file, pass a different `fileName` for something else.
// If you want the path to the project's directory, pass `fileName=""`.
export function projectsPath(filename="index.json", errorMessage = "Invalid path") {
  if (!isValidPath(filename)) throw new TypeError(`${errorMessage}: '${filename}'`);
  return fsPath.join(config.paths.projects, filename);
}

// Return the path for a project file.
// Default is to return the `project.jsx` file, pass a different `fileName` for something else.
// If you want the path to the project's directory, pass `fileName=""`.
export function projectPath(project, filename="project.jsx", errorMessage) {
  const projectPath = fsPath.join(project, filename);
  return projectsPath(projectPath, errorMessage);
}

// Return the path for a stack file.
// Default is to return the `stack.jsx` file, pass a different `fileName` for something else.
// If you want the path to the stack's directory, pass `fileName=""`.
export function stackPath(project, stack, filename="stack.jsx", errorMessage) {
  const stackPath = fsPath.join("stacks", stack, filename);
  return projectPath(project, stackPath, errorMessage);
}

// Return the path for a card file.
// Default is to return the card's `.jsx` file, pass a different `extension` for something else.
export function cardPath(project, stack, card, extension="", errorMessage) {
  const cardPath = fsPath.join("cards", card + extension);
  return stackPath(project, stack, cardPath, errorMessage);
}




// Assign all exports as a single object
export default Object.assign({}, exports);

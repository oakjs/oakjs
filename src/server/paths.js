//////////////////////////////
// Server-side project managment class
// NOTE: instantiating a project is really lightweight
//       so you can do so dynamically when servicing requests.
//////////////////////////////

import config from './config';

//////////////////////////////
//  Path utilities
//////////////////////////////

export function isValidPath(path) {
  if (path.includes("//")) return false;
  return path.split("/").every(segment => segment !== "." && segment !== "..");
}

// Root of all of our project files.
export const PROJECT_ROOT = config.paths.projects + "/";

// Return the path for a project file.
// Default is to return the `project.jsx` file, pass a different `fileName` for something else.
// If you want the path to the project's directory, pass `fileName=""`.
export function projectPath(project, filename="project.jsx", errorMessage = "Invalid path") {
  const path = project + "/" + filename;
  if (!isValidPath(path)) throw new TypeError(`${errorMessage}: '${path}'`);
  return PROJECT_ROOT + path;
}

// Return the path for a stack file.
// Default is to return the `stack.jsx` file, pass a different `fileName` for something else.
// If you want the path to the stack's directory, pass `fileName=""`.
export function stackPath(project, stack, filename="stack.jsx", errorMessage) {
  return projectPath(project, "stacks/"+stack+"/"+filename, errorMessage);
}

// Return the path for a card file.
// Default is to return the card's `.jsx` file, pass a different `extension` for something else.
export function cardPath(project, stack, card, extension=".jsx", errorMessage) {
  return stackPath(project, stack, "cards/"+card+extension, errorMessage);
}




// Assign all exports as methods on a `paths` object
const paths = Object.assign({}, exports);

// And make that the default export.
export default paths;

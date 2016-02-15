// Project/Stack/Card
export Card from "./Card";
export Parser from "./Parser";
export Project from "./Project";
export Stack from "./Stack";

// Card components.
// NOTE: in a separate file so we don't get a circular dependency.
import * as cardComponents from "./components";
Object.assign(exports, cardComponents);


// get all of the components
const components = Object.keys(exports);

// Export the root of the oak namespace
export oak from "./oak";

// Attach all of the components to the oak namespace
components.forEach(key => exports.oak[key] = exports[key]);

export default oak;

// include theme components
import { default as themeComponents } from "./theme.js";
Object.assign(exports, themeComponents);

// Add oak components
import { default as oakComponents } from "oak";
Object.assign(exports, oakComponents);

// Export map as the default
export default exports;

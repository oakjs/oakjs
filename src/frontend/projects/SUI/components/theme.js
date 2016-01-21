const components = {};

/* Add theme components */

// add SUI components and extras globally
import SUI from "themes/SUI";
import { default as extras } from "themes/SUI/extras";
Object.assign(components, SUI);

/* Export components */
export default components;

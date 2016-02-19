// Top level classes / higher order classes.
export API from "./API";
export CustomEvent from "./CustomEvent";
export Eventful from "./Eventful";
export Loadable from "./Loadable";
export Mutable from "./Mutable";
export Savable from "./Savable";

export * from "./util";

// export all of the above as a single `roots` object
const roots = new (function roots(){})();
Object.assign(roots, exports);

export default roots;

// globalize for debugging / reflection
import global from "./util/global";
global.roots = roots;

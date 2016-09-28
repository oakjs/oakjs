// Top level classes / higher order classes.
export Action from "./Action";
export AcornParser from "./AcornParser";
export API from "./API";
export DragProps from "./DragProps";
export Loadable from "./Loadable";
export LoadableIndex from "./LoadableIndex";
export Point from "./Point";
export PreferentialComponent from "./PreferentialComponent";
export Rect from "./Rect";
export Savable from "./Savable";
export UndoQueue from "./UndoQueue";

export * from "./util";

// export all of the above as a single `roots` object
const roots = new (function roots(){})();
Object.assign(roots, exports);

export default roots;

// globalize for debugging / reflection
import global from "./util/global";
global.roots = roots;

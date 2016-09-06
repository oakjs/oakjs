//
//  "Oak" package
//
import Oak from "./components";
exports.Oak = Oak;

// Export each item under its "package name".
for (let key in Oak) {
  exports[`Oak.${key}`] = Oak[key];
}


//
// Editor package
//
import Editor from "./Editor";
exports.Editor = Editor;
// export each item under its "package name".
for (let key in Editor) {
  exports[`Editor.${key}`] = Editor[key];
}


//
// Adapted SUI components
// TODO: this should be dynamic...
import SUI from "./theme/SUI";
exports.SUI = SUI;
// Mark all of the SUI components as coming from the "SUI" package
// and export under their "package name".
for (let key in SUI) {
  exports[`SUI.${key}`] = SUI[key];
}

// Export all as a map
export default Object.assign({}, exports);

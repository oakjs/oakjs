// Components for individual consumption,
export Control from "./Control";
export { Checkbox, Input, Output, Password, Text } from "./Control";
export { CSSLength } from "./CSSControls";
export Dropdown from "./Dropdown";
export ElementEditor from "./ElementEditor";
export Error from "./Error";
export Form from "./Form";
export Group from "./Group";
export Label from "./Label";
export NumericUnitControl from "./NumericUnitControl";
export { HTMLSelect, Select } from "./Select";


// Set "package" of the components
// DEPRECATED?
for (let key in exports) {
  exports[key].package = "Editor";
}

// Export all as a map
export default Object.assign({}, exports);

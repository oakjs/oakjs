// Components which can be used in a page.
export ActionItem from "./ActionItem";
export AppMenubar from "./AppMenubar";
export Columns from "./Columns";
export CurrentPage from "./CurrentPage";
export CurrentProject from "./CurrentProject";
export CurrentSection from "./CurrentSection";
export EditorToolbar from "./EditorToolbar";
export Link from "./Link";
export { PageLink } from "./Link";
export { SectionLink } from "./Link";
export { ProjectLink } from "./Link";
export { RouteLink } from "./Link";
export { AnchorLink } from "./Link";
export Page from "./Page";
export Project from "./Project";
export Section from "./Section";
export PageMenuItem from "./PageMenuItem";
export ProjectMenu from "./ProjectMenu";
export ProjectMenuItem from "./ProjectMenuItem";
export Resizer from "./Resizer";
export ResizeHandle from "./ResizeHandle";
export RunnerPage from "./RunnerPage";
export RunnerProject from "./RunnerProject";
export RunnerSection from "./RunnerSection";
export Spacer from "./Spacer";
export SelectionOverlay from "./SelectionOverlay";
export SectionMenu from "./SectionMenu";
export Stub from "./Stub";

// Mark all of the above components as coming from the "Oak" package
for (let key in exports) {
  const component = exports[key];
  component.package = "Oak"
  // export under "package name" as well
  exports["Oak-"+key] = component;
}

// NOTE: do NOT set Oak.Component package since project-specific components base off of that
export OakComponent from "./OakComponent";

// Adapted SUI components
// TODO: this should be dynamic...
import SUIComponents from "./theme/SUI";

// Mark all of the SUI components as coming from the "SUI" package
for (let key in SUIComponents) {
  const component = SUIComponents[key];
  component.package = "SUI"
  // export under "package name" as well
  exports["SUI-"+key] = component;
}


// Export all as a map
export default Object.assign({}, SUIComponents, exports);

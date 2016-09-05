// All public oak components.
export ActionItem from "./ActionItem";
export AppMenubar from "./AppMenubar";
export Columns from "./Columns";
export ComponentMenu from "./ComponentMenu";
export CurrentPage from "./CurrentPage";
export CurrentProject from "./CurrentProject";
export CurrentSection from "./CurrentSection";
export EditorToolbar from "./EditorToolbar";
export FixedPanel from "./FixedPanel";
export Link, { AnchorLink, PageLink, ProjectLink, RouteLink, SectionLink } from "./Link";
export Page from "./Page";
export Panel, { PanelFooter, PanelHeader, LeftSidebar, RightSidebar } from "./Panel";
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
export PageMenu from "./PageMenu";
export Stub from "./Stub";
export SplitPanel from "./SplitPanel";

// Set "package" of the components
// DEPRECATED?
for (let key in exports) {
  exports[key].package = "Oak";
}

// Do `OakComponent` AFTER doing the package stuff
//  so we don't bleed that package through to project-specific components.
export OakComponent from "./OakComponent";

// Export all as a map
export default Object.assign({}, exports);

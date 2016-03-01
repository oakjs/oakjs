// custom stack components


import Bug from "./Bug.jsx"
import Cropper from "./Cropper.jsx"
import Enablers from "./Enablers.jsx"
import Example from "./Example.jsx"
import Flippers from "./Flippers.jsx"
import InfoHint from "./InfoHint.jsx"
import IconSample from "./IconSample.jsx"
import Info from "./Info.jsx"
import LoremIpsum from "./LoremIpsum.jsx"
import Page from "./Page.jsx"
import PageTitle from "./PageTitle.jsx"
import PageSidebar from "./PageSidebar.jsx"
import PageSection from "./PageSection.jsx"
import Todo from "./Todo.jsx"
import Warning from "./Warning.jsx"

app.setProjectTheme("SUI", {
  ...SUI.components,

  ...oak.components,

  Bug,
  Cropper,
  Enablers,
  Example,
  Flippers,
  InfoHint,
  IconSample,
  Info,
  LoremIpsum,
  Page,
  PageTitle,
  PageSidebar,
  PageSection,
  Todo,
  Warning,
});

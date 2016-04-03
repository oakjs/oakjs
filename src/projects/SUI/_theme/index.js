// custom section components


import Bug from "./Bug.jsx"
import Cropper from "./Cropper.jsx"
import Enablers from "./Enablers.jsx"
import Example from "./Example.jsx"
import Flippers from "./Flippers.jsx"
import InfoHint from "./InfoHint.jsx"
import IconSample from "./IconSample.jsx"
import Info from "./Info.jsx"
import LoremIpsum from "./LoremIpsum.jsx"
import PageTitle from "./PageTitle.jsx"
import PageSection from "./PageSection.jsx"
import Todo from "./Todo.jsx"
import Warning from "./Warning.jsx"

oak.setProjectTheme("SUI", {
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
  PageTitle,
  PageSection,
  Todo,
  Warning,
});

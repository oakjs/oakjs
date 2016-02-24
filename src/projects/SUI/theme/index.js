// custom stack components

app.setProjectTheme("SUI", {
  ...SUI.components,

  ...oak.components,

  Bug: require("./Bug.jsx"),
  Cropper: require("./Cropper.jsx"),
  Enablers: require("./Enablers.jsx"),
  Example: require("./Example.jsx"),
  Flippers: require("./Flippers.jsx"),
  InfoHint: require("./InfoHint.jsx"),
  IconSample: require("./IconSample.jsx"),
  Info: require("./Info.jsx"),
  LoremIpsum: require("./LoremIpsum.jsx"),
  Page: require("./Page.jsx"),
  PageTitle: require("./PageTitle.jsx"),
  PageSidebar: require("./PageSidebar.jsx"),
  PageSection: require("./PageSection.jsx"),
  Todo: require("./Todo.jsx"),
  Warning: require("./Warning.jsx"),

});

//////////////////////////////
//
//  "Install"-level component setup.
//
//  Dictates which components will be automatically packaged with your application
//  and will be available for use in Pages, etc.
//
//  For each "package" of components you want to be available to all projects in this install:
//    1) Install the components (or a symbolic link) to them in this directory.
//
//    2) Create a "dynamic loader" file (as `<packageName>.all.js`) in this directory
//        which loads each component with a webpack `require.ensure` for each component.
//        See `./Editor.all.js` for an example.
//
//    3) Create a "package file" (as `<packageName>.js`) in this directory
//       which registers your components as a package.
//       See `./Editor.js` for an example.
//
//    4) (optional) In your package file, directly import any components
//       that you KNOW will be needed when your app starts up.
//       This will include them in the main build, minimizing startup round trips.
//       See `./Oak.js` for an example.
//
//    5) (optional) In your package file, set up `editorProps` to dictate
//       drag and drop particulars for your components.
//       See `./SUI.js` for an example.
//
//    6) Import your package file below.
//
//  NOTE: This file is included in `src/router/index.js`, which makes webpack bundle it for us.
//
//////////////////////////////

// Built-in oak components.
import "./Oak.js";

// Oak Editor package (for simple forms)
import "./Editor.js";

// Semantic UI components
import "./SUI.js";

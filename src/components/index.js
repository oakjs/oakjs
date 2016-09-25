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
//    2) Create a "package file" (as `<packageName>.js`) in this directory
//       which registers your components as a package.
//       (see `Editor.js` for a simple example.)
//
//    3) (optional) In your package file, set up `editorProps` to dictate drag and drop particulars.
//       (see `SUI.js` for an example).
//
//    4) Import your package file below.
//
//  NOTE: This file is included in `src/router/index.js`, which makes webpack bundle it for us.
//
//////////////////////////////

import oak from "../oak/oak";

// Built-in oak components.
import "./Oak.js";

// Oak Editor package (for simple forms)
import "./Editor.js";

// Semantic UI components
import "./SUI.js";

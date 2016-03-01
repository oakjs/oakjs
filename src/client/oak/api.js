//////////////////////////////
//  oakjs api
//////////////////////////////

import API from "oak-roots/API";
import oak from "./oak";
import JSXElement from "./JSXElement";

oak.api = new API({

  //////////////////////////////
  // Component bundles
  //////////////////////////////

  loadComponentBundle(controller) {
    const url = `/api/${controller.type}/${controller.path}/${controller.type}`;
    const errorMessage = `Error loading ${controller.type} bundle`;
    return this.getJSON(url, undefined, errorMessage)
      .then(bundle => {
        if (bundle.jsxe) {
          try {
            bundle.jsxElement = JSXElement.parse(bundle.jsxe);
            delete bundle.jsxe;
          }
          catch (e) {
            console.group(`Error parsing JSXE from ${url}`);
            console.error(e);
            console.groupEnd();
            throw e;
          }
        }
        return bundle;
      })
      .catch(e => {
        console.error(e);
        throw new ReferenceError(errorMessage);
      });
  },


  //////////////////////////////
  // Component JSXE files
  //////////////////////////////

  loadControllerJSXE(controller) {
    const url = `/api/${controller.type}/${controller.path}/jsxe`;
    const errorMessage = `Error loading ${controller.type} component`;
    return this.getText(url)
      // Go from JSX to a JSXElement
      // If the JSX didn't actually change, keep the same element!
      .then(jsxe => {
        if (controller.controller && controller.controller.toString() === jsxe) return controller.controller;
        try {
          return JSXElement.parse(jsxe);
        }
        catch (e) {
          console.group(`Error parsing JSXE from ${controller.componentUrl}`);
          console.error(e);
          console.groupEnd();
          throw e;
        }
      })
      .catch(e => {
        throw new ReferenceError(errorMessage);
      });
  },

//   saveControllerJSXE(controller) {
//     const url = `/api/${controller.type}/${controller.path}/jsxe`;
//     if (controller.component === undefined) return;
//     console.info(`Saving ${controller.type} component`);
//     return this.post(url, controller.component.toString());
//   },


  //////////////////////////////
  // Component CSS files
  //////////////////////////////

  loadControllerStyles(controller) {
    const url = `/api/${controller.type}/${controller.path}/styles`;
    // Attempt to load the CSS file but swallow any errors (assuming the file doesn't exist).
    return this.getText(url)
            .catch( error => { return undefined });
  },

//   saveControllerStyles(controller) {
//     const url = `/api/${controller.type}/${controller.path}/styles`;
//     if (controller.styles === undefined) return;
//     console.info(`Saving ${controller.type} styles`);
//     return this.post(url, controller.styles);
//   },


  //////////////////////////////
  // Component Script files
  //////////////////////////////

  loadControllerScript(controller) {
    const url = `/api/${controller.type}/${controller.path}/script`;
    // Attempt to load script but swallow any errors, assuming the file doesn't exist).
    return this.getText(url)
            .catch( error => { return undefined });
  },

//   saveControllerScript(controller) {
//     const url = `/api/${controller.type}/${controller.path}/script`;
//     if (controller.script === undefined) return;
//     console.info(`Saving ${controller.type} script`);
//     return this.post(url, controller.script);
//   },


  //////////////////////////////
  // Component Index files
  //////////////////////////////

  loadProjectIndex(controller) {
    const url = `/api/app/projectIndex`;
    const errorMessage = "Error loading project index";
    return this.loadIndex(url, undefined, );
  },

  loadStackIndex(controller) {
    const url = `/api/project/${controller.path}/stackIndex`;
    const errorMessage = "Error loading stack index";
    return this.loadIndex(url, undefined, errorMessage);
  },

  loadCardIndex(controller) {
    const url = `/api/stack/${controller.path}/cardIndex`;
    const errorMessage = "Error loading card index";
    return this.loadIndex(url, undefined, errorMessage);
  },

  loadIndex(url, fetchParams={}, errorMessage = "Error loading index") {
    return this.getJSON(url, fetchParams, errorMessage);
  },

//   saveIndex(url, errorMessage = "Error saving index", index) {
//     return this.post(url, controller.index);
//   },


  //////////////////////////////
  // Utility
  //////////////////////////////


});

export default oak.api;

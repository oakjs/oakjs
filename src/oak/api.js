//////////////////////////////
//  oakjs api
//////////////////////////////

import API from "oak-roots/API";

import JSXFragment from "./JSXFragment";

// TODO: do as a subclass so we get class definition semantics?
export default new API({

  //////////////////////////////
  // Component bundles
  //////////////////////////////

  // Load a bundle for some ComponentController as a JSON blob.
  loadComponentBundle(controller, fetchParams) {
    const url = `/api/${controller.type}/${controller.path}/${controller.type}`;
    const errorMessage = `Error loading ${controller.type} bundle`;
    return this.getJSON(url, fetchParams, errorMessage);
  },

  // Save `data` as a JSON blob for some ComponentController.
  saveComponentBundle(controller, data, fetchParams) {
    const url = `/api/${controller.type}/${controller.path}/save`;
    const errorMessage = `Error saving ${controller.type} bundle`;
    return this.post(url, JSON.stringify(data), fetchParams, errorMessage);
  },

  // Change id of some ComponentController (affects the disk).
  // NOTE: does not affect client indices...
  changeComponentId(controller, newId, fetchParams) {
    const url = `/api/${controller.type}/${controller.path}/changeId`;
    const errorMessage = `Error renaming ${controller.type} bundle`;
    const data = { newId };
    return this.post(url, JSON.stringify(data), fetchParams, errorMessage);
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
          return JSXFragment.parse(jsxe);
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

  loadProjectIndex() {
    const url = `/api/oak/projectIndex`;
    const errorMessage = "Error loading project index";
    return this.loadIndex(url, undefined, );
  },

  loadSectionIndex(projectPath) {
    const url = `/api/project/${projectPath}/sectionIndex`;
    const errorMessage = "Error loading section index";
    return this.loadIndex(url, undefined, errorMessage);
  },

  loadPageIndex(sectionPath) {
    const url = `/api/section/${sectionPath}/pageIndex`;
    const errorMessage = "Error loading page index";
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

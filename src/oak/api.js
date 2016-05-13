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
  // No argument normalization.
  loadComponentBundle({ type, path }, fetchParams) {
    const url = `/api/${type}/${path}/${type}`;
    const errorMessage = `Error loading ${type} ${path} bundle`;
    return this.getJSON(url, fetchParams, errorMessage);
  },

  // Save `data` as a JSON blob for some ComponentController.
  // Response returns the component's bundle.
  // No argument normalization.
  saveComponentBundle({ type, path, data }, fetchParams) {
    const url = `/api/${type}/${path}/save`;
    const errorMessage = `Error saving ${type} ${path} bundle`;
    return this.post(url, data, fetchParams, errorMessage)
            .then( response => response.json() );
  },

  // Create a new component (Project, Section, Page)
  // No argument normalization.
  createComponent({ type, path, title, data, position }, fetchParams) {
    // position is 1-based, so subtract 1 if it's a number
    if (typeof position === "number") position--;

    const url = `/api/${type}/${path}/create`;
    const postData = { title, data, position };
    const errorMessage = `Error creating ${type} at ${path}`;
    return this.post(url, postData, fetchParams, errorMessage)
            .then( response => response.json() );
  },

  // Delete a component (Project, Section, Page)
  // No argument normalization.
  deleteComponent({ type, path }, fetchParams) {
    const url = `/api/${type}/${path}/delete`;
    const errorMessage = `Error deleting ${type} bundle`;
    return this.post(url, "", fetchParams, errorMessage)
            .then( response => response.json() );
  },

  // Change id of some ComponentController (affects the disk).
  // Response returns the parent index JSON data.
  // NOTE: does not affect client indices...
  // No argument normalization.
  changeComponentId({ type, path, toId }, fetchParams) {
    const url = `/api/${type}/${path}/changeId`;
    const postData = { toId };
    const errorMessage = `Error changing id of ${type} ${path}`;
    return this.post(url, postData, fetchParams, errorMessage)
            .then( response => response.json() );
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

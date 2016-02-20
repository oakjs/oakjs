//////////////////////////////
//  oakjs api
//////////////////////////////

import API from "oak-roots/API";
import oak from "./oak";
import JSXElement from "./JSXElement";

oak.api = new API({

  //////////////////////////////
  // Projects index
  //////////////////////////////
  loadProjectIndex(controller, fetchParams={}) {
    const url = `/api/projects/index`;
    return this.getJSON(url, fetchParams, "Error loading projects index");
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

  saveControllerJSXE(controller) {
    const url = `/api/${controller.type}/${controller.path}/jsxe`;
    if (controller.component === undefined) return;
    console.info(`Saving ${controller.type} component`);
    return this.post(url, controller.component.toString());
  },


  //////////////////////////////
  // Component CSS files
  //////////////////////////////

  loadControllerStyles(controller) {
    const url = `/api/${controller.type}/${controller.path}/css`;
    // Attempt to load the CSS file but swallow any errors (assuming the file doesn't exist).
    return this.getText(url)
            .catch( error => { return undefined });
  },

  saveControllerStyles(controller) {
    const url = `/api/${controller.type}/${controller.path}/css`;
    if (controller.styles === undefined) return;
    console.info(`Saving ${controller.type} styles`);
    return this.post(url, controller.styles);
  },


  //////////////////////////////
  // Component Script files
  //////////////////////////////

  loadControllerScript(controller) {
    const url = `/api/${controller.type}/${controller.path}/script`;
    // Attempt to load script but swallow any errors, assuming the file doesn't exist).
    return this.getText(url)
            .catch( error => { return undefined });
  },

  saveControllerScript(controller) {
    const url = `/api/${controller.type}/${controller.path}/script`;
    if (controller.script === undefined) return;
    console.info(`Saving ${controller.type} script`);
    return this.post(url, controller.script);
  },


  //////////////////////////////
  // Component ChildIndex files
  //////////////////////////////

  loadControllerChildIndex(controller) {
    const url = `/api/${controller.type}/${controller.path}/index`;
    return this.getJSON(url, null, `Error loading ${controller.type} index`);
  },

  saveControllerChildIndex(controller) {
    const url = `/api/${controller.type}/${controller.path}/index`;
    if (controller.childIndex === undefined) return;
    console.info(`Saving ${controller.type} childIndex`);
    return this.post(url, controller.childIndex);
  },


});

export default oak.api;

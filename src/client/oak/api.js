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

  loadControllerBundle(controller) {
    const url = `/api/${controller.type}/${controller.path}/bundle`;
    const errorMessage = `Error loading ${controller.type} bundle`;
    return this.getJSON(url)
      .then(results => {
        if (results.jsxe) {
          try {
            results.component = JSXElement.parse(results.jsxe);
            delete results.jsxe;
          }
          catch (e) {
            console.group(`Error parsing JSXE from ${url}`);
            console.error(e);
            console.groupEnd();
            throw e;
          }
        }
        return results;
      })
      .catch(e => {
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
    const url = `/api/${controller.type}/${controller.path}/styles`;
    // Attempt to load the CSS file but swallow any errors (assuming the file doesn't exist).
    return this.getText(url)
            .catch( error => { return undefined });
  },

  saveControllerStyles(controller) {
    const url = `/api/${controller.type}/${controller.path}/styles`;
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
  // Component Index files
  //////////////////////////////

  _getComponentIndexUrl(type, controller) {
    switch (type) {
      case "app":       return `/api/app/projectIndex`;
      case "project":   return `/api/project/${controller.path}/stackIndex`;
      case "stack":     return `/api/stack/${controller.path}/cardIndex`;
    }
    throw new TypeError(`api.getComponentIndexUrl(${controller}): cant get url for this type`);
  },

  loadComponentIndex(type, controller, fetchParams={}) {
    const url = this._getComponentIndexUrl(type, controller);
    return this.getJSON(url, fetchParams, `Error loading ${type} index`);
  },

  saveComponentIndex(type, controller, index) {
    if (index === undefined) return Promise.resolve();
    const url = this._getComponentIndexUrl(type, controller);
    console.info(`Saving ${controller.type} index`);
    return this.post(url, controller.index);
  },


  //////////////////////////////
  // Utility
  //////////////////////////////


});

export default oak.api;

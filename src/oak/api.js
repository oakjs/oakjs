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
  loadComponentBundle({ component }, fetchParams) {
    const { type, path } = component;
    const url = `/api/${type.toLowerCase()}/bundle/${path}`;
    const errorMessage = `Error loading ${type} ${path} bundle`;
    return this.getJSON(url, fetchParams, errorMessage);
  },

  // Save `data` as a JSON blob for some ComponentController.
  // Response returns the component's bundle.
  // No argument normalization.
  saveComponentBundle({ component, data }, fetchParams) {
    const { type, path } = component;
    const url = `/api/${type.toLowerCase()}/save/${path}`;
    const errorMessage = `Error saving ${type} ${path}`;
    return this.post(url, data, fetchParams, errorMessage)
            .then( response => response.json() );
  },

  // Create a new component (Project, Section, Page)
  // No argument normalization.
  createComponent({ type, path, data, indexData, position }, fetchParams) {
    const url = `/api/${type.toLowerCase()}/create/${path}`;
    const postData = { data, indexData, position };
    const errorMessage = `Error creating ${type} at ${path}`;
    return this.post(url, postData, fetchParams, errorMessage)
            .then( response => response.json() );
  },

  // Duplicate a component and all children (Project, Section, Page)
  // No argument normalization.
  duplicateComponent({ type, path, newId, indexData, position }, fetchParams) {
    const url = `/api/${type.toLowerCase()}/duplicate/${path}`;
    const postData = { newId, indexData, position };
    const errorMessage = `Error duplicating ${type}`;
    return this.post(url, postData, fetchParams, errorMessage)
            .then( response => response.json() );
  },

  // Rename some component (change it's id).
  // Response returns the parent index JSON data.
  // NOTE: does not affect client indices...
  // No argument normalization.
  renameComponent({ type, path, newId, indexData }, fetchParams) {
    const url = `/api/${type.toLowerCase()}/rename/${path}`;
    const postData = { newId, indexData };
    const errorMessage = `Error changing id of ${type} ${path}`;
    return this.post(url, postData, fetchParams, errorMessage)
            .then( response => response.json() );
  },

  // Delete a component (Project, Section, Page)
  // No argument normalization.
  deleteComponent({ type, path }, fetchParams) {
    const url = `/api/${type.toLowerCase()}/delete/${path}`;
    const errorMessage = `Error deleting ${type}`;
    return this.post(url, "", fetchParams, errorMessage)
            .then( response => response.json() );
  },

  // UNdelete a component (Project, Section, Page)
  // No argument normalization.
  undeleteComponent({ type, path, indexData, position }, fetchParams) {
    const url = `/api/${type.toLowerCase()}/undelete/${path}`;
    const postData = { indexData, position };
    const errorMessage = `Error undeleting ${type}`;
    return this.post(url, postData, fetchParams, errorMessage)
            .then( response => response.json() );
  },


  //////////////////////////////
  // Component JSXE files
  //////////////////////////////

  loadControllerJSXE(controller) {
    const { type, path } = controller;
    const url = `/api/${type.toLowerCase()}/jsxe/${path}`;
    const errorMessage = `Error loading ${type} component`;
    return this.getText(url)
      // Go from JSX to a JSXElement
      // If the JSX didn't actually change, keep the same element!
      .then(jsxe => {
        if (controller.controller && controller.controller.toString() === jsxe) return controller.controller;
        try {
          return JSXFragment.parse(jsxe, { controller });
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
//     const { type, path } = controller;
//     const url = `/api/${type.toLowerCase()}/jsxe/${path}`;
//     if (controller.component === undefined) return;
//     console.info(`Saving ${type} component`);
//     return this.post(url, controller.component.toString());
//   },


  //////////////////////////////
  // Component CSS files
  //////////////////////////////

  loadControllerStyles(controller) {
    const { type, path } = controller;
    const url = `/api/${type.toLowerCase()}/styles/${path}`;
    // Attempt to load the CSS file but swallow any errors (assuming the file doesn't exist).
    return this.getText(url)
            .catch( error => { return undefined });
  },

//   saveControllerStyles(controller) {
//    const { type, path } = controller;
//     const url = `/api/${type.toLowerCase()}/styles/${path}`;
//     if (controller.styles === undefined) return;
//     console.info(`Saving ${type} styles`);
//     return this.post(url, controller.styles);
//   },


  //////////////////////////////
  // Component Script files
  //////////////////////////////

  loadControllerScript(controller) {
    const { type, path } = controller;
    const url = `/api/${type.toLowerCase()}/script/${path}`;
    // Attempt to load script but swallow any errors, assuming the file doesn't exist).
    return this.getText(url)
            .catch( error => { return undefined });
  },

//   saveControllerScript(controller) {
//    const { type, path } = controller;
//     const url = `/api/${type.toLowerCase()}/script/${path}`;
//     if (controller.script === undefined) return;
//     console.info(`Saving ${type} script`);
//     return this.post(url, controller.script);
//   },


  //////////////////////////////
  // Component Index files
  //////////////////////////////

  loadProjectIndex(fetchParams) {
    const url = `/api/account/index`;
    const errorMessage = "Error loading account index";
    return this.getJSON(url, fetchParams, errorMessage);
  },

// NOT IMPLEMENTED ON SERVER YET...
//   saveProjectIndex(indexData, fetchParams) {
//     const url = `/api/oak/account/index`;
//     const errorMessage = "Error saving account index";
//     return this.post(url, indexData, fetchParams, errorMessage)
//             .then( response => response.json() );
//   },


  loadControllerIndex(controller, fetchParams) {
    const { type, path } = controller;
    const url = `/api/${type.toLowerCase()}/index/${path}`;
    const errorMessage = `Error loading ${type} index for ${path}`;
    return this.getJSON(url, fetchParams, errorMessage);
  },



//   saveIndex(url, errorMessage = "Error saving index", index) {
//     return this.post(url, controller.index);
//   },


  //////////////////////////////
  // Component JSX files
  //////////////////////////////

  // Load the server-compiled `JSXE` + `CSS` for a `ComponentController`.
  // Returns a script expression which will `eval()` to the Component class.
  loadControllerJSX(controller) {
    const { type, path } = controller;
    const url = `/api/${type.toLowerCase()}/compile/${path}`;
    const errorMessage = `Error loading ${type} JSX component`;
    return this.getText(url)
      .catch(e => {
        throw new ReferenceError(errorMessage);
      });
  },

  // Load the server-compiled Component class for a `ComponentController`.
  // Returns the instantiated Component constructor.
  loadControllerComponent(controller) {
    return this.loadControllerJSX(controller)
      // convert to a Component
      .then(compiledJSX => {
        console.groupCollapsed(`Loaded compiled JSX for ${controller}`);
        console.log(compiledJSX);
        console.groupEnd();

        try {
          // eval to get the compiled component
          let Component;
          eval(`Component = ${compiledJSX}`);
          return Component;
        }
        catch (e) {
          console.group(`Error compiling JSX from ${controller}`);
          console.error(e);
          console.groupEnd();
          throw e;
        }
      });
  }



});

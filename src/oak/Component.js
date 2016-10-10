import _ from "lodash";

import { dieIfMissing } from "oak-roots/util/die";

import api from "./api";
import JSXFragment from "./JSXFragment";

export default class Component {
  constructor(...propMaps) {
    // You can pass just a path as a convenience.
    if (propMaps.length === 1 && typeof propMaps[0] === "string")
      this.path = propMaps[0];
    else
      // Assign all propMaps to this object
      Object.assign(this, ...propMaps);

    // if we got a `jsxe` property, convert it to a `jsxFragment`
// NOTE: this might happen on 'rehydration'
    if ("jsxe" in this) {
      console.warn("new Component(): converting `jsxe` to `jsxFragment`");
      if (typeof this.jsxe === "string") this.jsxFragment = JSXFragment.parse(this.jsxe);
      delete this.jsxe;
    }

    // Freeze it!  We're immutable!!!
    if (process.env.NODE_ENV !== "production") {
      if (!this.path) throw new Error("Error creating Component: no path specified!", this);
      Object.freeze(this);
    }
  }

  // Return a clone of this object.
  // Pass `newProps` to assign new properties to the clone.
  clone(newProps) {
    return new Component(this, newProps);
  }

//
//  Syntactic sugar
//
  // Component `id`: the last step of our path
  get id() {
    return Component.splitPath(this.path)[1];
  }

  // Path and pointer to our parent
  get parentPath() {
    return Component.splitPath(this.path)[0];
  }
  getParent(projectMap = Component.projectMap) {
    return projectMap[this.parentPath];
  }

  // Load state sugar
  get isUnloaded() {
    return this.loadState === undefined;
  }
  get isLoading() {
    return !!(this.loadState === "loading" || this.loadState && this.loadState.then);
  }
  get isLoaded() {
    return this.loadState === "loaded";
  }
  get isLoadError() {
    return this.loadState instanceof Error;
  }

  // Return all children as an array.
  // Returns empty array if no children.
  // If you specify `type`, we'll return only children of that type.
  getChildren(type, projectMap = Component.projectMap) {
    if (!this.index) return [];
    return this.index.map(id => {
      const childPath = Component.joinPath(this.path, id);
      const child = projectMap[childPath];
      if (child && (!type || child.type === type)) return child;
    }).filter(Boolean);
  }

//
//  Data, serialization and saving
//
  // Properties that we save to the server.
  static _FIELDS_TO_SAVE_ = ["jsxe", "type", "css", "js", "jsx"];
  // Properties that we save in our parent's index.
  static _INDEX_DATA_FIELDS_ = ["id", "type", "title"];

  // Return data to save to the server for this component.
  getDataToSave() {
    // get JSON data minus any fields we explicitly do NOT send to the server
    const output = _.pick(this.toJSON(), Component._FIELDS_TO_SAVE_);

    // add `id` (we save that instead of `path`)
    output.id = this.id;

    // Update the `index` we save with the index data from our children
    if (this.index)
      output.index = this.getChildren().map(child => _.pick(child, Component._INDEX_DATA_FIELDS_));

    return output;
  }

  // Special `toJSON` routine to serialize as simple object.
  // NOTE: this is also what we save to the server...
  toJSON() {
    const output = {};
    _.forIn(this, (value, key) => {
      // skip anything that's undefined
      if (value === undefined) return;

      switch (key) {
        case "jsxFragment":
          output.jsxe = value.toJSX();
          break;

        case "loadState":
          if (value && value.then) output.loadState = "loading";
          else if (value instanceof Error) output.loadState = `error: ${value.message}`;
          else output.loadState = value;
          break;

        default:
          output[key] = value;
      }
    });
    return output;
  }


//
//  Static utlity methods
//

  // Return current `projectMap` from the very latest version of the store.
  // NOTE: this is dependent on `Component.store` being set to the Redux `store` when it is created.
  static get projectMap() {
    return Component.store.getState().projectMap;
  }

  // Path for the `Account` singleton.
  static _ACCOUNT_PATH_ = "/";

  // Return the `Account` as a component.
  // Useful for knowing about loading, list of all projects, etc.
  static getAccount(projectMap = Component.projectMap) {
    return projectMap[Component._ACCOUNT_PATH_];
  }

  // Return LATEST VERSION of component given `path` from `projectMap`.
  // You can pass a string `path` or a `Component` instance.
  static get(path, projectMap = Component.projectMap) {
    // If passed a Component, look up in the projectMap anyway in case component is stale.
    if (path instanceof Component) return projectMap[path.path];
    return projectMap[path];
  }

  // Split path into strings `[parentPath, id]`.
  // If this the `Account`, parentPath will be `undefined`.
  static splitPath(path) {
    // special case for account path
    if (path === "/") return [undefined, "/"];

    const split = path.split("/");
    const id = split.pop();
    let parent = split.join("/") || "/";
    if (!parent) parent = undefined;
    return [parent, id];
  }

  // Return parentPath for a `path`.
  static getParentPath(path) { return Component.splitPath(path)[0]; }

  // Join `parentPath` and `id` into a single path.
  // NOTE: ALL paths should start with `"/"`.
  // NOTE: the `Account` path is `"/"`.
  static joinPath(parentPath = Component._ACCOUNT_PATH_, id) {
    // special case for root path
    if (parentPath === "/") return `/${id}`;
    return `${parentPath}/${id}`;
  }


//
//  Process bits of the component that can be loaded.
//

  // Properties associated with our loaded data.
  // These will be cleared if there's an error in loading the component.
  static _ALL_DATA_FIELDS_ = ["loadState", "jsxFragment", "css", "js", "jsx", "index"];

  // Unload the component at `path` and remove all its children.
  // If you pass any `componentProps`, we'll update the component with those before returning.
  // Returns clones of `[projectMap, component]`.
  static _unloadDataAndChildren(projectMap, component, newProps) {
    // First remove any children from the component
    let mapClone = { ...projectMap };
    let clone = component;

    if (component.children)
      [mapClone, clone] = Component._deleteComponentChildren(mapClone, component.path);

    // remove all data props and add newProps to new clone
    const nonDataProps = _.omit(clone, Component._ALL_DATA_FIELDS_);
    clone = new Component(nonDataProps, newProps);
    mapClone[component.path] = clone;

    return [mapClone, clone];
  }


  // Set all applicable `data` for `component`.
  // Returns clones of `[projectMap, component]`
  // Throws if anything goes wrong.
  static _setData(projectMap, component, data) {
    let clone = component.clone();
    clone = Component._setJSXE(clone, data.jsxe);
    clone = Component._setCSS(clone, data.CSS);
    clone = Component._setJS(clone, data.js);
    clone = Component._setJSX(clone, data.jsx);
    // processing the index may affect other things in the projectMap
    let mapClone = { ...projectMap };
    [mapClone, clone] = Component._setIndex(mapClone, clone, data.index);

    // update loadState and stick in the projectMap
    clone = clone.clone({ loadState: "loaded" });
    mapClone[clone.path] = clone;

    return [mapClone, clone];
  }

  // Set `jsxe` for component, converting to a `JSXFragment`.
  // Throws if we can't convert.
  // If the fragment is different than our current fragment, returns a clone of `compoenent`,
  //  otherwise returns original `component`.
  static _setJSXE(component, jsxe) {
    // bail if empty and we don't have a jsxFragment
    if (!jsxe && !component.jsxFragment) return component;

    // bail if no change
    if (component.jsxFragment && component.jsxFragment.toJSX() === jsxe) return component;

    const jsxFragment = jsxe ? JSXFragment.parse(jsxe) : undefined;
    return component.clone({ jsxFragment });
  }

  // Set `css` for a component.
  // Returns clone of `component` if there was a change.
  static _setCSS(component, css) {
    // bail if no change
    if (css === component.css) return component;
    // Return clone with new css.
    return component.clone({ css });
  }

  // Process loaded component `js` string.
  // Returns clone of `component` if there was a change.
  static _setJS(component, js) {
    // bail if no change
    if (js === component.js) return component;
    // Return clone with new js
    return component.clone({ js });
  }

  // Process loaded component `jsx` string.
  // Returns clone of `component` if there was a change.
  static _setJSX(component, jsx) {
    if (jsx) console.error(`Component._setJSX(): convert jsx to a class?!?!?`);
    // bail if no change
    if (jsx === component.jsx) return component;
    // Return clone with new js
    return component.clone({ jsx });
  }

  // Process loaded component `index` array of `{ id, title, type }`.
  //  - Updates clone of `component` with index of child id's.
  //  - Adds things in the `index` to the `projectMap`.
  //  - Removes children which we knew about before but are not in the new index from `projectMap`.
  // Returns clone of `[projectMap, component]`.
  static _setIndex(projectMap, component, index) {
    let mapClone = projectMap;
    let childIds;
    // Process index children, returning map of just ids
    if (index) {
      childIds = index.map(props => {
        if (!props.id) {
          console.error(`_processIndex(${component.path}): no 'id' for child`, props);
          return undefined;
        }
        const path = Component.joinPath(component.path, props.id);
        mapClone = Component._addComponentToMap(mapClone, path, props);
        return props.id;
      });
    }

    // Remove any children which we DID know about but are no longer in the index.
    if (childIds && component.index) {
      const missingChildren = _.difference(component.index || [], childIds);
      missingChildren.forEach(childId => {
        const childPath = Component.joinPath(component.path, childId);
        mapClone = Component._deleteComponent(projectMap, childPath);
      });
    }

    // If there was a change in the component index, clone and update in the projectmap
    if (childIds !== component.index) {
      const clone = component.clone({ index: childIds });
      mapClone = {
        ...mapClone,
        [clone.path]: clone
      };
      return [mapClone, clone];
    }

    return [mapClone, component];
  }

  // Remove a component from the `path`, also:
  //    - removing item id from parent's index.
  //    - recursively removing all children.
  //
  // Returns new `projectMap` if any change.
  static _deleteComponent(projectMap, path, updateParentIndex) {
    const component = Component.get(path, projectMap);

    // If not in the list, return the original projectMap
    if (component === undefined) return projectMap;

    // Remove component from projectMap.
    // Doing this BEFORE the below is more efficient.
    let mapClone = _.omit(projectMap, path);

    // Recursively remove all children of the component.
    mapClone = Component._deleteComponentChildren(mapClone, path)[0];

    // remove component from its parent's `index`
    if (updateParentIndex) {
      const [parentPath, id] = Component.splitPath(path);
      if (parentPath) {
        const parent = mapClone[parentPath];
        if (parent && parent.index && parent.index.includes(id)) {
          // removing id from index, and add clone of parent to map clone
          const index = _.without(parent.index, id);
          mapClone[parent.path] = parent.clone({ index });
        }
      }
    }
    return mapClone;
  }

  // Recursively delete all children of `component` at `path` from `projectMap`.
  // Also clears `component.index`.
  // Returns clones of `[projectMap, component]` if any change.
  static _deleteComponentChildren(projectMap, path) {
    const component = Component.get(path, projectMap);

    // If not in the list, return the original projectMap
    if (component === undefined || !component.index || !component.index.length)
      return [projectMap, component];

    // Recursively remove all children of the component.
    let mapClone = { ...projectMap };
    component.index.forEach(childId => {
      const childPath = Component.joinPath(component.path, childId);
      mapClone = Component._deleteComponent(mapClone, childPath);
    });

    // Remove child index from component and update in map.
    const clone = component.clone({ index: undefined });
    mapClone[path] = clone;

    return [mapClone, clone];
  }

  // Add component at `path` to `projectMap`.
  // Returns a clone of `projectMap` if any change.
  // NOTE: does NOT update parent index (???)
  static _addComponentToMap(projectMap, path, props) {
    const component = Component.get(path, projectMap);
    // If we already have a component and they didn't pass props, return the original projectMap
    if (component && !props) return projectMap;

    const clone = component ? component.clone(props) : new Component({ path }, props);
    return {
      ...projectMap,
      [path]: clone
    };
  }

  // Update `path` of component and all its children.
  // Returns clone of `projectMap` if any change.
  static _updateComponentPath(projectMap, oldPath, newPath) {
    const component = projectMap[oldPath];
    if (!component) return projectMap;

    // Update children FIRST!
    let mapClone = { ...projectMap };
    if (component.index) {
      component.index.forEach(childId => {
        const oldChildPath = Component.joinPath(oldPath, childId);
        const newChildPath = Component.joinPath(newPath, childId);
        mapClone = Component._updateComponentPath(mapClone, oldChildPath, newChildPath);
      });
    }

    // Update the component itself
    delete mapClone[oldPath];
    mapClone[newPath] = component;

    return mapClone;
  }


//
//  Reducers
//

  // Overall reducer.
  static reducer(projectMap = {}, action) {
    const handler = Component.reducers[action.type];
    if (handler) return handler(projectMap, action);
    return projectMap;
  }

  // Individual reducers as a handler map.
  // Switch statements are for chumps!
  static reducers = {

    LOAD_ACCOUNT: (projectMap, action) => {
      const { path, loadPromise } = action;
      const account = projectMap[path] || new Component({ path, type: "Account" });
      // Remember the `loadPromise` as the `loadState` to re-use if called again while loading.
      const clone = account.clone({ loadState: loadPromise || "loading" });
      return {
        ...projectMap,
        [clone.path]: clone
      };
    },

    // Account loading succeeded or failed (if there's an `error`).
    LOADED_ACCOUNT: (projectMap, action) => {
      const { path, data, error } = action;
      const account = projectMap[path];
      // update properties of clone using utility processing routines
      try {
        if (error) throw error;
        return Component._setData(projectMap, account, data)[0];
      }
      catch (exception) {
        console.error(`error processing LOADED_COMPONENT for '${path}':`, exception);
        const loadState = error instanceof Error ? error : new Error(exception);
        return Component._unloadDataAndChildren(projectMap, account, { loadState })[0];
      }
    },

    LOAD_COMPONENT: (projectMap, action) => {
      const { path, loadPromise } = action;
      // get a clone of existing component or create a new one if not found
      const component = projectMap[path] || new Component(path);
      // Remember the `loadPromise` as the `loadState` to re-use if called again while loading.
      const clone = component.clone({ loadState: loadPromise });
      return {
        ...projectMap,
        [clone.path]: clone
      };
    },

    // Component loading succeeded or failed (if there's an `error`).
    LOADED_COMPONENT: (projectMap, action) => {
      const { path, data, error } = action;
      // get a existing component, creating a new one if not found
      const component = projectMap[path] || new Component(path);

      // update properties of clone using utility processing routines
      try {
        if (error) throw error;
        return Component._setData(projectMap, component, data)[0];
      }
      catch (exception) {
        console.error(`error processing LOADED_COMPONENT for '${path}':`, exception);
        const loadState = error instanceof Error ? error : new Error(exception);
        return Component._unloadDataAndChildren(projectMap, component, { loadState })[0];
      }
    },

    UNLOAD_COMPONENT: (projectMap, action) => {
      const { path } = action;
      const component = projectMap[path];
      if (!component) return projectMap;  // TODO...???
      return Component._unloadDataAndChildren(component)[0];
    },

    DELETED_COMPONENT: (projectMap, action) => {
      const { path } = action;
      return Component._deleteComponent(projectMap, path, "UPDATE_PARENT");
    },

    DELETE_COMPONENT_ERROR: (projectMap, action) => {
      const { path, error } = action;
      console.error(`error deleting component '${path}':`, error);
      // Go ahead and delete it anyway...
      return Component._deleteComponent(projectMap, path, "UPDATE_PARENT");
    },

    RENAMED_COMPONENT: (projectMap, action) => {
      const { path, newId } = action;
      const component = projectMap[path];
      const parent = component && component.getParent(projectMap);
      if (!component || !parent) return projectMap;    // TODO...???

      // Change our id in our parent's index.
      let mapClone = { ...projectMap };
      const index = parent.index.map(childId => childId === component.id ? newId : childId);
      mapClone[parent.path] = parent.clone({ index });

      // Update path of component and all children
      const newPath = Component.joinPath(parent.path, newId);
      mapClone = Component._updateComponentPath(mapClone, path, newPath);

      return mapClone;
    },

    RENAME_COMPONENT_ERROR: (projectMap, action) => {
      const { path, error } = action;
      console.error(`error renaming component '${path}':`, error);
      return projectMap;
    },

    CREATED_COMPONENT: (projectMap, action) => {
      const { parentPath } = action;
      const { parentIndex, id, type, data } = action.data;

      const parent = projectMap[parentPath];
      if (!parent) return projectMap; // TODO... ???

      // set parent index first
      let mapClone = Component._setIndex(projectMap, parent, parentIndex)[0];

      // create component and tell it about its data
      const path = Component.join(parentPath, id);
      const component = mapClone[path] || new Component({ path, type });
      mapClone = Component._setData(mapClone, component, data)[0];

      return mapClone;
    },

    CREATE_COMPONENT_ERROR: (projectMap, action) => {
      const { path, error } = action;
      console.error(`error creating component '${path}':`, error);
      return projectMap;
    }

  }

//
//  Action creators
//  You can call these as `Component.actions.loadAccount()`.
//  Note that they're all self-dispatching!
//
  static actions = {

    // Navigate to a component.
    navigateTo(path) {
      return (dispatch) => {
        console.error("Someone needs to define the NAVIGATE_TO_COMPONENT method!");
        dispatch({ type: "NAVIGATE_TO_COMPONENT", path });
      };
    },

    // Load the `accounts` list (list of projects).
    loadAccount() {
      return (dispatch) => {
        const path = Component._ACCOUNT_PATH_;

        const loadPromise = api.loadProjectIndex();
        // Dispatch to show we're loading
        dispatch({ type: "LOAD_ACCOUNT", path, loadPromise });

        return loadPromise
          .then(
            // treat as a component response
            (data) => dispatch({ type: "LOADED_ACCOUNT", path, data }),
            (error) => dispatch({ type: "LOADED_ACCOUNT", path, error })
          );
      };
    },

    // Load a component, returning a promise which resolves or rejects when it completes.
    // Returns immediately if component is loading, loaded or had an error when loading last time.
    loadComponent(path, forceReload) {
      return (dispatch, getState) => {
        console.warn("loadComponent(): editability???");
        // Get current component data, rejecting if we can't find it.
        const component = Component.get(path, getState().projectMap);
        if (!component)
          return Promise.reject(new Error(`loadComponent(${path}): Component not found`));

        if (!forceReload) {
          // If component is loading, return its loading promise (stored in `loadState`)
          if (component.isLoading()) return component.loadState;

          // If component is loaded, return resolved promise
          if (component.isLoaded()) return Promise.resolve();

          // If already had a load error, return rejected promise.
          if (component.isLoadError()) return Promise.reject();
        }

        // load!
        const loadPromise = api.loadComponentBundle(component);

        // Update app state to note that we're loading
        dispatch({ type: "LOAD_COMPONENT", path, loadPromise });

         // Dispatch success or error message when loading completes.
        return loadPromise.then(
          (data) => dispatch({ type: "LOADED_COMPONENT", path, data }),
          (error) => dispatch({ type: "LOADED_COMPONENT", path, error })
        );
      };
    },

    // Reload a component, whether it's currently loaded or not.
    reloadComponent(path) {
      return Component.actions.loadComponent(path, "FORCE_RELOAD");
    },

    // Remove all loaded data from component, including removing its children.
    unloadComponent(path) {
      return (dispatch, getState) => {
        const component = Component.get(path, getState().projectMap);
        if (!component)
          return Promise.reject(new Error(`unloadComponent(${path}): Component not found`));
        dispatch({ type: "UNLOAD_COMPONENT", path });
      };
    },

    // Save a component.
    saveComponent(path) {
      return (dispatch, getState) => {
        const component = Component.get(path, getState().projectMap);
        if (!component) return undefined; // TODO...???

        // Dispatch initial delete action for placement in the undo queue
        dispatch({ type: "SAVE_COMPONENT", path });

        const saveData = component.getDataToSave();
        return api.saveComponentBundle(component, saveData)
          .then(
            (data) => dispatch({ type: "SAVED_COMPONENT", data }),
            (error) => dispatch({ type: "SAVE_COMPONENT_ERROR", path, error })
          );
      };
    },

    // Delete a component specified by `path`.,
    deleteComponent(path) {
      return (dispatch, getState) => {
        // forget it if the component isn't it the projectMap
        const component = Component.get(path, getState().projectMap);
        if (!component) return Promise.resolve();

        // Dispatch initial delete action for placement in the undo queue
        dispatch({ type: "DELETE_COMPONENT", path });

        // Call api routine to actually delete.
        return api.deleteComponent(component)
          // ...then dispatch success or error message as appropriate
          .then(
            () => dispatch({ type: "DELETED_COMPONENT", path }),
            (error) => dispatch({ type: "DELETE_COMPONENT_ERROR", path, error })
          );
      };
    },

    // Rename component at `path`.
    renameComponent({ path, newId, navigate }) {
      return (dispatch, getState) => {
        // forget it if the component isn't it the projectMap
        const component = Component.get(path, getState().projectMap);
        if (!component) return Promise.reject();

        // Dispatch initial delete action for placement in the undo queue
        dispatch({ type: "RENAME_COMPONENT", path, newId });

        // Call api routine to actually rename
        console.error("TODO: api.renameComponent() shouldn't need type");
        return api.renameComponent({ type:component.type, path, newId })
          // ...then dispatch success or error message as appropriate
          .then(
            () => {
              dispatch({ type: "RENAMED_COMPONENT", path, newId });
              // dispatch navigation event if necessary
              if (navigate) {
                const newPath = Component.joinPath(Component.getParentPath(path), newId);
                Component.actions.navigateTo(newPath);
              }
            },
            (error) => dispatch({ type: "RENAME_COMPONENT_ERROR", path, error })
          );
      };
    },

    // Create a new component.
    createComponent(options) {
      return (dispatch) => {
        dieIfMissing(options, "createComponent", ["parentPath", "props"]);
        dieIfMissing(options.props, "createComponent", ["type", "id"]);
        const { parentPath, props, position, navigate } = options;
        const { type, id } = props;

        const path = Component.joinPath(parentPath, id);

        // Dispatch initial create action for placement in the undo queue
        dispatch({ type: "CREATE_COMPONENT", path });

        // call api creation routine
        console.warn("`api.createComponent()` should use `props` instead of `data`, `indexData`");
        api.createComponent({ type, path, props, position })
          .then(
            (data) => {
              dispatch({ type: "CREATED_COMPONENT", parentPath, data });
              // dispatch navigation event if necessary
              if (navigate) {
                // NOTE: server might have changed `id` if it wasn't unique!
                const newPath = Component.joinPath(parentPath, data.id);
                Component.actions.navigateTo(newPath);
              }
            },
            (error) => dispatch({ type: "CREATE_COMPONENT_ERROR", path, error })
          );
      };
    },

    // Duplicate a component.
    duplicateComponent(options) {
      return (dispatch, getState) => {
        dieIfMissing(options, "duplicateComponent", ["path", "props"]);
        dieIfMissing(options.props, "duplicateComponent", ["newId"]);
        const { path, props, position, navigate } = options;
        const { newId } = props;

        const projectMap = getState().projectMap;
        const component = Component.get(path, projectMap);
        if (!component) return Promise.reject();

        // Dispatch initial duplicate action for placement in the undo queue
        dispatch({ type: "DUPLICATE_COMPONENT", path, newId });

        // call api duplicate routine
        console.warn("change `api.duplicateComponent()` to take `props` rather than `indexData`");
        api.duplicateComponent({ type: component.type, path, newId, position })
          .then(
            (data) => {
              const parentPath = component.parentPath;
              dispatch({ type: "CREATED_COMPONENT", parentPath, data });
              // dispatch navigation event if necessary
              if (navigate) {
                // NOTE: server might have changed `id` if it wasn't unique!
                const newPath = Component.joinPath(parentPath, data.id);
                Component.actions.navigateTo(newPath);
              }
            },
            (error) => dispatch({ type: "DUPLICATE_COMPONENT_ERROR", path, error })
          );
      };
    }
  } // end `actions`

}// end `class`

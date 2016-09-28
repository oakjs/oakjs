//////////////////////////////
//
//  Register components as a "package" to be used dynamically.
//
//////////////////////////////

import React from "react";

// <Stub/> component to return while we're loading.
class Stub extends React.Component {
  render(){
    return null
  };
}


// Given a component `packageName` and `key`, return its `packageId`.
export function getPackageId(packageName, key) {
  return `${packageName}.${key}`;
}


// Register a map of `components` under `packageName`.
// Allows you to access the components in `Page`s etc as `<packageName.componentName>`.
// `components` should be actual `React.Components` or `statelesss functional components`.
export function registerComponents(owner, packageName, components) {
  console.log(`registering ${packageName} components`);

  // Initilize package as necessary
  const pkg = _initComponentPackage(owner, packageName);

  // Register under `packageName.componentName` as well.
  Object.keys(components).forEach( key => {
    // skip non-functions (e.g. `default` in case it creeps in)
    const component = components[key];
    if (!(component instanceof Function)) return;

    // remember the packageId for reflection
    _setPackageId(component, packageName, key);

    // Register under the package
    // NOTE: we `delete` first in case there's a getter there (e.g. from a loader)
    delete pkg[key];
    pkg[key] = component

    // Define a top-level alias under the packageId
    _setComponentAlias(owner, packageName, key);
  });

  return pkg;
}


// Register a dynamic map of component `loaders` with `owner` under `packageName`.
// Loads components dynamically as necessary on first access, returning a `<Stub/>` while loading.
// `loaders` should be something like:
//    `export function MenuHeader(callback){ require.ensure([], () => callback(require("./MenuHeader"))) };`
export function registerComponentLoaders(owner, packageName, loaders) {
  console.log(`registering dynamic ${packageName} components`);

  // Initilize package as necessary
  const pkg = _initComponentPackage(owner, packageName);
  Object.keys(loaders).forEach( key => {
    // skip non-functions (e.g. `default` in case it creeps in)
    const loader = loaders[key];
    if (!(loader instanceof Function)) return;

    // Set up a getter which will load the package for us, returning a `<Stub>` in the meantime.
    Object.defineProperty(pkg, key, {
      enumerable: true,
      configurable: true,
      get: _getDynamicComponent(owner, pkg, packageName, key, loader)
    });

    // Define a top-level alias under the packageId
    _setComponentAlias(owner, packageName, key);
  });

  return pkg;
}


//
//  Utility functions for the above
//

// Initialize a package of components for the owner.
// Returns the package object.
function _initComponentPackage(owner, packageName) {
  if (!owner.components) owner.components = {};
  // create package if necessary
  const pkg = owner.components[packageName] || {};
  // assign to owner
  owner.components[packageName] = pkg;
  return pkg;
}


// Return a `getter` to load a component given a `require.ensure()` `loader`.
function _getDynamicComponent(owner, pkg, packageName, key, loader) {
  const packageId = getPackageId(packageName, key);

  // Set flag to `true` to avoid calling loader repeatedly.
  var loading = false;

  // If item is already in memory, the loader callback will fire immediately.
  // We'll assign the `loaded` component to so we can return immediately.
  var loaded;

  return function() {
    // Skip loading if we're already in the process of loading this item.
    if (!loading) {
      loader( function(component) {

        // Get the `default` item from the package if we didn't get a function.
        if (typeof component !== "function" && typeof component["default"] === "function") {
          component = component["default"];
        }

        // If we still don't have a function, warn and keep returning the `<Stub/>`.
        if (typeof component !== "function") {
          console.error(`error loading component ${packageId}: loader did not return a function.`, component);
          component = Stub;
        }
        else {
          // assign to `loaded` so we can return this immediately below.
          loaded = component;
          // remember the packageId for reflection
          _setPackageId(component, packageName, key);
        }

        // Replace this getter with the the loaded component,
        // circumventing the whole loading process next time.
        delete pkg[key];
        pkg[key] = component;

        // If we actaully had to load, update the UI soon.
        if (loading) owner.updateSoon();
      });

      // Log only if callback didn't fire immediately (and thus we actually need to load).
      if (!loaded) console.log(`loading ${packageId}`);
    }

    // mark as loading for next property access
    loading = true;

    // Return a stub while we're loading if it wasn't already in memory
    return loaded || Stub;
  }
}


// Set `packageId` for a `component`.
// Use this so we'll warn if the same component gets different packageIds.
function _setPackageId(component, packageName, key) {
  const packageId = getPackageId(packageName, key);
  if (component.hasOwnProperty("packageId") && component.packageId !== packageId) {
    console.warn(`component packageId changing from ${component.packageId} to ${packageId}`, component);
  }
  component.packageId = packageId
}

// Define a top-level alias to a package component as `<packageName>.<key>`.
function _setComponentAlias(owner, packageName, key) {
  const packageId = getPackageId(packageName, key);
  // delete current value first in case someone else set up a getter
  delete owner.components[packageId];
  // define a getter which points to the package
  Object.defineProperty(owner.components, packageId, {
    enumerable: true,
    configurable: true,
    get() { return owner.components[packageName][key] }
  });
}


// Export all as a lump
export default {...exports};

//////////////////////////////
// Loadable higher-order class.
//
//  Call `instance.load()` to load data.
//
//  If an instance is already loaded and you `load()` again,
//  it'll resolve to the loaded data immediately without hitting the network.
//
//  Call `instance.unload()` or `instance.reload()` to force an unload.
//
// Works with OakMutables or normal classes
//
// If the base class has a `trigger()` instance method, generates events as loading proceeds.
//////////////////////////////

export default function Loadable(Constructor = Object) {

  // Internal routine to update the `__loadState` of a loadable.
  function _setLoadState(loadable, state) {
    // Remember when this changed
    if (state) state.timestamp = Date.now();

    // add the `__loadState` property if not defined directly on this object.
    if (!loadable.hasOwnProperty("__loadState")) {
      Object.defineProperty(loadable, "__loadState", { value: {}, writable: true });
    }

    if (loadable.mutate) loadable.mutate({ __loadState: state });
    else loadable.__loadState = state;

    return state;
  }

  return class Loadable extends Constructor {

    // OVERRIDE THIS and return a promise that resolves with your NORMALIZED data
    // If you have more than one thing to load, do a `Promise.all()`, eg:
    //    loadData() {
    //      return Promise.all([ this.loadOneThing(), this.loadAnother() ])
    //    }
    //
    // If you want to transform the data that's returned, do it as a `then()` inside this function, eg:
    //    loadData() {
    //        return this.loadSomethingNotQuiteRight(...)
    //          .then(notQuiteRightData => { return fixData(notQuiteRightData) })
    //    }
    //
    // If your loader routine might throw an error and you want to swallow it (continue as if load completed)
    //  do that as a `catch()` inside this function, eg:
    //    loadData() {
    //        return this.loaderWhichMightFail(...)
    //          .catch(error => { return anAlternateResult; })
    //    }
    loadData() {
      throw new TypeError("You must override the loadData() routine.");
    }

    // Callback AFTER our data has been loaded.
    // `data` is the results of the `loadData()` promise.
    onLoaded(data) {}


    // Callback when there's a load error.
    // `error` is the error that resulted from our `loadData()` promise being rejected or throwing an error.
    // If you want to perform some action when loading fails, override this method.
    onLoadError(error) {}


  //////////////////////////////
  // NOTE: The code below is completely generic and complete.
  //       You can call these routines, but do NOT override it unless you know what you're doing!
  //////////////////////////////

    // Syntactic sugar for detecting load states.
    get isUnloaded() { return !this.__loadState || this.__loadState.state === undefined }
    get isLoading() { return this.__loadState && this.__loadState.state === "loading" }
    get isLoaded() { return this.__loadState && this.__loadState.state === "loaded" }
    get loadError() { return this.__loadState && this.__loadState.error }

    // Time that we were last loaded
    get lastLoaded() {
      return (this.isLoaded && this.__loadState && this.__loadState.timestamp) || undefined;
    }

    // Load this resource.
    //
    // Returns a promise which will `resolve()` with the loaded data,
    //  or `reject()` if something goes wrong.
    //
    // If we're already loaded, simply returns the loaded data WITHOUT RELOADING.
    // If we're in the process of loading, returns the current loading promise.
    // So you can call this repeatedly wihtout incurring extra server round trips.
    //
    // If you want to force a reload, call `.reload()` or `.unload()`.
    //
    // NOTE: do NOT override this -- override `loadData()` instead!
    //
    load(force) {
//TODO: build in cache time ???
//TODO: hand not-modified when reloading
//TODO: if we have data and we're realoading and data is invalid... ???
      // If we're already loaded, return the data returned by the last load
      if (this.isLoaded && !force) return Promise.resolve(this.__loadState.data);

      // If we're loading, return our loading promise
      if (this.isLoading) return this.__loadState.promise;

      const loadPromise = new Promise( (resolve, reject) => {
        // loadError handler
        const _loadError = (error) => {
          _setLoadState(this, { state: "error", error })
          this.onLoadError(error);
          this.trigger("loadError", error);
          reject(error);
        };

        try {
          // mark us as loading
          _setLoadState(this, { state: "loading", promise: loadPromise });
          if (this.trigger) this.trigger("loading");

          this.loadData()
            // handle successful load
            .then(data => {
              this.loaded(data);
              resolve(data);
            })
            // handle load failure
            .catch(error => {
              _loadError(error);
            });
        }
        // if loadData fails, fail the load immediately
        catch (error) {
          _loadError(error);
        }
      });

      return loadPromise;
    }

    // Force a reload, no matter whether we were previously loaded or not.
    reload() {
      if (this.trigger) this.trigger("reloading");
      this.load("FORCE");
    }

    // Unload us, removing all of our loaded data.
    unload() {
      _setLoadState(this, undefined);
      if (this.trigger) this.trigger("unloaded");
    }

    // Simulate a server load of some data.
    // NOTE: don't override this to detect when data is loaded, override `onLoaded()` instead
    loaded(data) {
      _setLoadState(this, { state: "loaded", data: data });
      this.onLoaded(data);
      // trigger the `loaded` event
      if (this.trigger) this.trigger("loaded", data);
    }

  }
}

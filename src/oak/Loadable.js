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
    // `data` is the normalized results of the `loadData()` promise.
    // If you want to save the data somehow, do it here.
    // If you don't, you can just call `this.load()` again to get a new promise with the same data.
    onLoaded(data) {}


    // Callback when there's a load error.
    // `error` is the error that resulted from our `loadData()` promise being rejected,
    // or from `onLoaded()` causing an error.
    //
    // If you want to raise the error, return it (or some other appropriate error object).
    // If you want to swallow the error, `return undefined`.
    onLoadError(error) {
      return error;
    }

    // Syntactic sugar for detecting load states.
    get isUnloaded() { return !this.__loadState || this.__loadState.state === undefined }
    get isLoading() { return this.__loadState && this.__loadState.state === "loading" }
    get isLoaded() { return this.__loadState && this.__loadState.state === "loaded" }
    get loadError() { return this.__loadState && this.__loadState.error }

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
    load() {
      // If we have loaded or are loading, return our loading promise
      if (this.isLoaded || this.isLoading) return this.__loadState.promise;

      let loadPromise;
      try {
        loadPromise = this.loadData()
          .then(data => {
            this.loaded(data);
            return data;
          })
          // final catch in case something goes wrong either in the load or during normalization
          .catch(error => {
            this._loadError(error);
            // throw the error so observers of the loadPromise can `catch` it
            throw error;
          });

        this._setLoadState({ state: "loading", promise: loadPromise });
        if (this.trigger) this.trigger("loading");
      }
      catch (e) {
        this._loadError(e);
        loadPromise = Promise.reject(e);
      }

      return loadPromise;
    }

    // Force a reload, no matter whether we were previously loaded or not.
    reload() {
      if (this.trigger) this.trigger("reloading");
      this.unload();
      this.load();
    }

    // Unload us, removing all of our loaded data.
    unload() {
      this._setLoadState(undefined);
      this.trigger("unloaded");
    }

    // Simulate a server load of some data.
    // NOTE: don't override this, override `onLoaded()` instead
    loaded(data) {
      this._setLoadState({ state: "loaded", data: data, promise: Promise.resolve(data) });
      this.onLoaded(data);
      if (this.trigger) this.trigger("loaded", data);
      return data;
    }

    // A loadError happened, handle it.
    // NOTE: you shouldn't use this, override `loadError()` instead.
    _loadError(error) {
      this._setLoadState({ state: "error", error: error})
      this.onLoadError(error);
      this.trigger("loadError", error);
    }

    // Update our `__loadState` property.
    _setLoadState(loaded) {
      if (this.mutate) this.mutate({ __loadState: loaded });
      else this.__loadState = loaded;
    }
  }
}

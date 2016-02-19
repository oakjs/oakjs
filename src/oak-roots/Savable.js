//////////////////////////////
//  Savable higher-order class, companion to `Loadable`.
//
//  Call `.save()` to save our `data` if it's dirty.
//  Call `.forceSave()` to save our `data` if we think it's dirty or not.
//
//////////////////////////////

export default function Savable(Constructor = Object) {

  // Internal routine to update the `__saveState` of a savable.
  function _setSaveState(savable, state) {
    // Remember when this changed
    if (state) state.timeStamp = Date.now();

    // add the `__saveState` property if not defined directly on this object.
    if (!savable.hasOwnProperty("__saveState")) {
      Object.defineProperty(savable, "__saveState", { value: {}, writable: true });
    }

    if (savable.mutate) savable.mutate({ __saveState: state });
    else savable.__saveState = state;
  }


  // Extend the Constructor with our stuff!
  return class Savable extends Constructor {

    // OVERRIDE THIS to return a promise which resolves when you've saved your `data`.
    // If you have more than one thing to save, do a `Promise.all()`, eg:
    //    saveData() { return Promise.all([ this.saveOneThing(), this.saveAnother() ]) }
    saveData() {
      throw new TypeError("You must override the saveData() routine.");
    }

    // Callback AFTER we've saved.
    // `results` is the results of the `saveData()` promise.
    //
    // If you want to perform some action after saving completes, do it here.
    //
    onSaved(data) {}

    // Callback when there's a save error.
    // `error` is the error that resulted from our `saveData()` promise being rejected or throwing an error.
    onSaveError(error) {}

    // Return `true` if our `data` needs to be saved.
    // NOTE: By default, we maintain a `isDirty` bit so we don't save if there are no changes.
    //       If you want to ignore the dirty bit, override as:   `get isDirty() { return true }`
    //
    // Use `this.dirty()` to update our dirty state.
    get isDirty() { return this.__saveState && this.__saveState.isDirty };


  //////////////////////////////
  // NOTE: The code below is completely generic and complete.
  //       You can call these routines, but do NOT override them unless you know what you're doing!
  //////////////////////////////

    get isSaved() { return !this.isDirty };

    // Are we in the process of saving???
    get isSaving() { return this.__saveState && this.__saveState.state === "saving" };

    // Set our `dirty` flag.
    // By default, we set dirty to `true` -- if you have multiple pieces which may independently be dirty
    //  you can pass an object here with flags for each piece (but they won't be merged).
    dirty(dirty = true) {
      const state = this.__saveState || {};
      if (state.isDirty === dirty) return;
      state.isDirty = dirty;
      _setSaveState(this, state);
    }

    // Save this resource.
    //
    // Returns a promise which will `resolve()` with the results of the save,
    //  or `reject()` if something goes wrong.
    //
    // NOTE: if we're not loaded, loading or are in a loadError state, this is a no-op.
    // NOTE: if we're currently saving, this returns the promise from the current save.
    //
    // By default, we'll only save if we think `.isDirty === true`.
    // If you want to force a save, call `.forceSave()`.
    //
    // NOTE: do NOT override this -- override `saveData()` instead!
    //
    save(force) {
      const dirty = this.isDirty;
      const saveState = this.__saveState || {};

      // if we're already saving, return the saving promise
//TODO: ????
      if (this.isSaving) return saveState.promise;

      // Forget it if we're not in need of saving and we're not being forced.
      if ( this.isUnloaded
        || this.isLoading
        || this.loadError
        || (!dirty && !force)
      ) {
        return Promise.resolve(saveState.results);
      }

      const savePromise = new Promise( (resolve, reject) => {
        // saveError handler
        const _saveError = (error) => {
          _setSaveState(this, { state: "error", error, dirty})
          this.onSaveError(error);
          this.trigger("saveError", error);
          reject(error);
        };

        try {
          // mark us as saving
          _setSaveState(this, { state: "saving", promise: savePromise });
          if (this.trigger) this.trigger("saving");

          this.saveData()
            // handle successful save
            .then(data => {
              this.saved(data);
              resolve(data);
            })
            // handle save failure
            .catch(error => {
              _saveError(error);
            });
        }
        // if saveData fails, fail the save immediately
        catch (error) {
          _saveError(error);
        }
      });

      return savePromise;
    }

    // Force a save whether we think we're dirty or not.
    forceSave() {
      return this.save("FORCE");
    }

    // Simulate results coming back from a server save.
    // NOTE: don't override this, override `onSaved` instead.
    saved(results) {
      _setSavedState(this, { state: "saved", results });
      this.onSaved(results);
      if (this.trigger) this.trigger("saved", normalized);
      return results;
    }

    // Override our `loaded` routine to clear our dirty bit after saving succeeds.
    loaded(...args) {
      if (super.loaded) super.loaded(...args);
      this.dirty(false);
    }

  }
}

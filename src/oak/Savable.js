//////////////////////////////
//  Savable higher-order class, companion to `Loadable`.
//
//  ASSUMES that you're mixing this AFTER Loadable.
//
//  Call `.save()` to save our `data` if it's dirty.
//  Call `.forceSave()` to save our `data` if we think it's dirty or not.
//
//////////////////////////////

export default function Savable(Constructor = Object) {
  // Extend the Constructor with our stuff!
  return class Savable extends Constructor {
    // OVERRIDE THIS to return a promise which resolves when you've saved your `data`.
    // If you have more than one thing to save, do a `Promise.all()`, eg:
    //    saveData() { return Promise.all([ this.saveOneThing(), this.saveAnother() ]) }
    saveData(force) {
      throw new TypeError("You must override the saveData() routine.");
    }

    // Return `true` if our `data` needs to be saved.
    get isDirty() {
      return !!this.__dirty;
    }

    // Note that our data needs to be saved.
    set isDirty(newValue) {
      const oldValue = this.__isDirty;
      if (oldValue !== newValue) {
        this.__dirty = newValue;
        if (this.trigger) this.trigger("dirty", newValue);
      }
    }

    // Callback when we've saved.
    // `results` is the results of the `saveData()` promise.
    //
    // The output of this function will be provided to anyone watching our `onSaved` events.
    // You can manipulate the data and return something else if you like.
    //
    onSaved(data) {
      return data;
    }

    // Callback when there's a save error.
    // `error` is the error that resulted from our `saveData()` promise being rejected,
    // or from `onSaved()` causing an error.
    //
    // If you want to raise the error, return it (or some other appropriate error object).
    // If you want to swallow the error, `return undefined`.
    onSaveError(error) {
      return error;
    }


    // Save this resource.
    //
    // Returns a promise which will `resolve()` with the results of the save,
    //  or `reject()` if something goes wrong.
    //
    // NOTE: if we're not loaded, loading or are in a loadError state, this is a no-op.
    //
    // By default, we'll only save if we think `.isDirty === true`.
    // If you want to force a save, call `.forceSave()`.
    //
    // NOTE: do NOT override this -- override `saveData()` instead!
    //
    save(force = false) {
      // Forget it if we're not in need of saving and we're not being forced.
      if ( this.isUnloaded
        || this.isLoading
        || this.loadError
        || (!this.isDirty && !force) ) return Promise.resolve();

      this.saveData()
        .then(results => {
          const normalized = this.onSaved(results);
          if (this.trigger) this.trigger("saved", normalized);
          return normalized;
        })
        .catch(error => {
          const normalized = this.onSaveError(error);
          if (this.trigger) this.trigger("saveError", normalized);
          throw normalized;
        })
    }

    // Override our `loaded` routine to set dirty to false
    loaded(...args) {
      if (super.loaded) super.loaded(...args);
      this.isDirty = false;
    }

  }
}

// REFACTOR:    rename 'attributes' to 'props'  (setAttribute ?   only use mutate)
//              don't save props directly on object (use a getter)
//              CHILDREN ????  ARE WE STILL USING THIS??

//////////////////////////////
// Mutable base class with `props` and `children` support.
// The idea is that this is a mutatable object, but mutation is controlled.
//////////////////////////////

import Eventful from "./Eventful";
import objectUtil from "./util/object";

class Mutable extends Eventful() {

  constructor(props) {
    super();
    if (props) Object.assign(this, props);

    // define a non-enumerable `cache` object
    Object.defineProperty(this, "cache", { value: {}, writable: true });
  }

  //////////////////////////////
  //  Mutation
  //////////////////////////////

  // Mutate a number of properties of this object.
  // Returns an object of the changed properties if anything actually changed.
  // Returns `undefined` if no change.
  mutate(possibleMutations) {
    const [changes, current] = this.getDeltas(possibleMutations);
    if (!changes) return undefined;

    Object.assign(this, changes);
    this.onChanged(changes, current);
    return changes;
  }

  // Callback when we were actually mutated.
  // Triggers an "onChanged" event.
  // You can override this to do something special.
  onChanged(changes, current) {
    this.resetCache();
    if (this.trigger) this.trigger("onChanged", changes, current);
  }

  // Reset our cache object, eg: when we've been mutated.
  resetCache() {
//    console.log(this, ".resetCache()");
    this.cache = {};
  }

  // Return a new object with the properties in `deltas` which are actually different than our current values.
  getDeltas(deltas) {
    if (!deltas) return [];
    const changes = {};
    const current = {};
    let changesFound = false;
    for (let key in deltas) {
      if (this[key] !== deltas[key]) {
        current[key] = this[key];
        changes[key] = deltas[key];
        changesFound = true;
      }
    }
    return (changesFound ? [changes, current] : []);
  }

  //////////////////////////////
  //  Clone this object!
  //////////////////////////////

  // Return a SHALLOW clone of this element.
  // Override if you have other data which should be manipulated when cloning.
  clone() {
    const Constructor = this.constructor;
    const props = objectUtil.cloneProperties(this);
    return new Constructor(props);
  }

}

export default Mutable;

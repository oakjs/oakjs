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
  //  Manipulating props
  //////////////////////////////

  // Set one of our props to the specified `value`.
  // If `value` is `undefined`, we'll delete the property.
  // If `value` is the same as the current attribute value, has no effect.
  // Returns `true` if we actually changed the value.
//TODO: dotted names?
  setAttribute(name, value) {
    // bail if no change
    const currentValue = (this.props && this.props[name]);
    if (currentValue === value) return false;

    const props = Object.assign({}, this.props);
    if (value === undefined) {
      delete props[name];
    }
    else {
      props[name] = value;
    }

    this.mutate({ props: props });
    return true;
  }

  // Clear an attribute.
  // Returns `true` if we actually changed the value.
  clearAttribute(name) {
    return this.setAttribute(name, undefined);
  }



  //////////////////////////////
  //  Manipulating children
  //////////////////////////////

  // Add a `child` to this element.
  //
  // By default we put it at the end, you can specify an `index`
  //  to place it at the beginning (0) or in the middle, in which case
  //  we'll slide other elements over to accomodate it.
  //
  // Returns `true` if we actually added the element.
//TODO: if child is already present, move it???
  addChild(child, index) {
    if (child == null) return false;

    const children = (this.children ? [...this.children] : []);
    if (index === undefined) index = children.length;
    children.splice(index, 0, child);

    this.mutate({ children: children });
    return true;
  }


  // Remove a `child` from our `children`.
  // You can pass an actual child object or a numeric index.
  // Returns `true` if we actually removed the element.
  removeChild(child) {
    if (!this.children || child == null) return false;

    const index = (typeof child === "number" ? child : this.indexOfChild(child));
    if (index < 0 || index >= this.children.length) return false;

    const children = this.children.slice(0, index).concat(this.children.slice(index+1));
    this.mutate({ children: children });
    return true;
  }


  //////////////////////////////
  //  Clone this object!
  //////////////////////////////

  // Return a clone of this element and all of its children, sharing as much as we can.
  // Override if you have other data which should be manipulated when cloning.
  clone() {
    const Constructor = this.constructor;
    const clone = new Constructor(this);
    if (clone.props) clone.props = Object.assign({}, clone.props);
    if (clone.children) clone.children = clone.children.map(this.cloneChild, this);
    return clone;
  }

  // Clone a child.
  // The default version uses `objectUtil.clone()`, which will throw
  //  if child is of an unrecognized type, or doesn't have a `clone` method.
  //
  // Override this method to do something smarter, or use
  //     `objectUtil.registerCloner(Constructor, function cloner(value){....})`
  // to teach us how to clone that type of object.
  cloneChild(child) {
    return objectUtil.clone(child);
  }


}

export default Mutable;

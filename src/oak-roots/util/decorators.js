//////////////////////////////
//  Decorators
//////////////////////////////

// Pull core-decorators into scope
export throttle from "core-decorators/lib/throttle";
export debounce from "core-decorators/lib/debounce";
//export { throttle, debounce } from "core-decorators";

//////////////////////////////
// @proto decorator
//
//  Use this to create a SHARED field on the `class.prototype`.
//
//  e.g.  class SomeClass {
//          @proto
//          static someVar = 42
//        }
//        ....
//        SomeClass.prototype.someVar === 42;  // << true
//
//  NOTE: Doing this with an object or array is potentially very confusing,
//        use for scalars only.
//
//////////////////////////////
export function proto(target, key, descriptor) {
  // figure out the value of the descriptor
  let value = undefined;
  if ("value" in descriptor) value = descriptor.value;
  if ("initializer" in descriptor) value = descriptor.initializer();

  // figure out the prototype to assign to
  // NOTE: Different versions of babel (or different stages?) differ in what's passed in as `target`
  const prototype = (target.prototype || target.constructor.prototype);

  // assign the value to the prototype non-enumerable, non-configurable, but writable so subclasses can override
  Object.defineProperty(prototype, key, { value, writable: true });

  // return an empty descriptor to cancel assigning to the class
  return {}
}

// Export all as one map
export default {...exports};

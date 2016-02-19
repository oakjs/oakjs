//////////////////////////////
//  Object Utility functions
//////////////////////////////

// Return values for all properties of object as an array.
export function values(object) {
  if (object == null) return [];
  return Object.keys(object).map( key => object[key]);
}

// Map a `method` over all the keys/values of some `object`,
//  returning a new object with `{ key: method(value) }`.
//
// If input is `null` or `undefined`, output will be `undefined`.
//
// Signature of method is:  `method(value, key, object)`
export function map(object, method, thisArg) {
  if (object == null) return undefined;
  const output = {};
  Object.keys(object).forEach(key => output[key] = method.apply(thisArg, object[key], key, object));
  return output;
}

// Apply a `method` against an accumulator for all the keys/values of some `object`.
// Signature of method is:  `method(previousValue, value, key, object)`
export function reduce(object, method, initialValue) {
  if (object == null) return [];
  const reducer = (prev, key, index, keys) => method(prev, object[key], key, object);
  return Object.keys(object).reduce(reducer, initialValue);
}

// Return true if an object is `empty`, eg does not have any of its own properties.
export function isEmpty(object) {
  if (object == null) return true;
  return Object.keys(object).length === 0;
}


// Throw an error if `thing` is missing any required fields.
export function dieIfMissing(thing, fields, errorMessage = `Error in ${thing.constructor.name}`) {
  const missing = fields.filter(field => thing[field] == null);
  if (missing.length) throw new TypeError(errorMessage + ": missing " + missing.join("\n"));
}


//////////////////////////////
//  Cloning
//////////////////////////////

// Return a clone of some element.
function justReturnIt(value) { return value }
export const CLONERS = {
  // immutable types clone by just returning the value
  string: justReturnIt,
  boolean: justReturnIt,
  number: justReturnIt,
  function: justReturnIt,
  symbol: justReturnIt,
  undefined: justReturnIt
}

export function registerCloner(key, cloner) {
  CLONERS[key] = cloner;
}

// Add specific constructors
registerCloner(Object, function(object) { return Object.assign({}, object) })
registerCloner(Array, function(array) { return [].concat(array) })
registerCloner(Date, function(date) { return new Date(date) })

// Make a SHALLOW clone of some value.
export function clone(value) {
  if (value === null || value === undefined) return value;
  if (typeof value.clone === "function") return value.clone();
  const cloner = CLONERS[typeof value] || CLONERS[value.constructor];
  if (cloner) return cloner(value);
  throw new TypeError(`clone(${value}): dont know how to clone this type.`);
}



//////////////////////////////
//  Class utilties
//////////////////////////////

//  Return superclass constructors of a class, INCLUDING the class itself.
//  The class is first, then it's immediate super, etc all the way to `Object`.
//
//  Add it to a class when defining it to use it for the class + subclasses
//      import roots from "oak-roots"
//      class SomeClass extends SomeOtherClass {
//        static supers = roots.supers;
//      }
//      const supers = SomeClass.supers();  // << [SomeClass, SomeOtherClass, ..., Object]
//
//  or you can call it directly, passing a constructor:
//      const supers = roots.supers(SomeClass); // << same as above
export function supers(target = this) {
  const supers = [];
  while (target) {
    supers.push(target);
    if (target === Object) break;
    target = Object.getPrototypeOf(target.prototype).constructor;
  }
  return supers;
}


// Export all as one map
export default Object.assign({}, exports);

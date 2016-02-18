//////////////////////////////
//  Object Utility functions
//////////////////////////////


// Map a `method` over all the keys/values of some `object`.
// Signature of method is:  `method(value, key, object)`
export function map(object, method, thisArg) {
  if (object == null) return [];
  return Object.keys(object)
    .map( key => method.apply(thisArg, object[key], key, object));
}

// Return true if an object is `empty`, eg does not have any of its own properties.
export function isEmpty(object) {
  if (object == null) return true;
  return Object.keys(object).length === 0;
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

// Export all exports as one object as well
export default exports;

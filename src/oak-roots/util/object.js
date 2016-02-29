//////////////////////////////
//  Object Utility functions
//////////////////////////////

// Map callback over all own keys of an object,
//  accumulating results into an `output` value.
//
// Callback function signature:  `callback(previousOutput, value, key, object)`
export function reduce(object, method, initialOutputValue) {
  if (object == null) return initialOutputValue;
  let output = initialOutputValue;
  if (object) {
    const keys = Object.keys(object), length = keys.length;
    for (let i = 0; i < length; i++) {
      const key = keys[i];
      output = callback(output, object[key], key, object);
    }
  }
  return output;
}


// Map callback over all own keys of an object,
//  with results returned as an array, ordered by keys order.
//
// Callback function signature:  `callback(value, key, object)`
export function mapOwn(object, callback) {
  const results = [];
  if (object) {
    const keys = Object.keys(object), length = keys.length;
    for (let i = 0; i < length; i++) {
      const key = keys[i];
      results[i] = callback(object[key], key, object);
    }
  }
  return results;
}

// Map callback over all own keys of an object,
//  with results returned as a new object, mapped to original keys.
//
// Callback function signature:  `callback(value, key, object)`
export function mapToObject(object, callback) {
  const results = {};
  if (object) {
    const keys = Object.keys(object), length = keys.length;
    for (let i = 0; i < length; i++) {
      const key = keys[i];
      results[key] = callback(object[key], key, object);
    }
  }
  return results;
}


// Map callback over all own keys of an `object`,
//  returning a new object with only the keys/values of `object`
//  where `filter` returns a truthy value.
//
// Callback function signature:  `callback(value, key, object)`
export function filter(object, callback) {
  const results = {};
  if (object) {
    const keys = Object.keys(object), length = keys.length;
    for (let i = 0; i < length; i++) {
      const key = keys[i], value = object[key];
      if (callback(value, key, object)) results[key] = value;
    }
  }
  return results;
}



// Return values for all properties of object as an array.
export function values(object) {
  return mapOwn(object, function(value, key) { return value })
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

// Return a new object with any properties in `target` that ARE also found in `source`.
export function knownProperties(target, source = {}) {
  return filter(target, function(value, key) { return source.hasOwnProperty(key) });
}

// Return a new object with any properties in `target` that ARE NOT also found in `source`.
export function unknownProperties(target, source = {}) {
  return filter(target, function(value, key) { return !source.hasOwnProperty(key) });
}

// Return a new object with only properties in `target` that correspond to `keys`
export function properties(target, ...keys) {
  return filter(target, function(value, key) { return keys.includes(key) });
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

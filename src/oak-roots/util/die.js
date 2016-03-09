//////////////////////////////
//  Sudden death
//////////////////////////////

export function die(thing, operation, args, message = "") {
  let messages;
  // special message for dying in constructor function
  if (operation && operation.startsWith && operation.startsWith("new ")) {
    messages = [`${operation}(`, (args || ""), `): ${message}`];
  }
  else {
    messages = [thing, `.${operation}(`, (args || ""), `): ${message}`];
  }
  console.error(...messages);
  console.trace();
  throw new TypeError(messages.join(""));
}

// Throw an error if `thing` is missing any required fields.
export function dieIfMissing(thing, operation, fields) {
  const missing = fields.filter(field => thing[field] == null);
  if (!missing.length) return;
  const message = `Missing required field${missing.length > 1 ? "s" : ""}: ${missing.join(",")}`;
  die(thing, operation, undefined, message)
}

// Throw an error if a position is out of range from the array,
//  or the array is not defined, or position is not a number.
export function dieIfOutOfRange(thing, operation, array, position, lastPosition) {
  if (!array) die(thing, operation, [array, position], "array is not defined");

  if (typeof position !== "number") {
    die(thing, operation, [array, position], "position must be a number");
  }

  if (typeof lastPosition !== "number") lastPosition = array.length - 1;

  if (position < 0 || position > lastPosition) {
   die(thing, operation, [array, position], `position out of range [0-${lastPosition}]`);
  }
}


// Export all as one map
export default Object.assign({}, exports);

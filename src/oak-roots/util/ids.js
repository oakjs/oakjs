//////////////////////////////
//  ID Utility functions
//////////////////////////////


// Generate a random alphanumeric id (which will always start with a letter).
// NOTE: for uniqueness, use `uniquifyId()` within a list of `otherIds`.
export const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
export const ALPHA_NUMERIC = "0123456789" + ALPHA;
export function generateRandomId(length = 8, radix) {
  // make sure we don't start with a number so we're a legal identifier
  const letters = [ randomCharFrom(ALPHA, radix) ];
  for (let i = 1; i < length; i++) {
    letters[i] = randomCharFrom(ALPHA_NUMERIC, radix);
  }
  return letters.join("");
}

export function randomCharFrom(chars, radix) {
  const validRadix = (radix == null ? chars.length - 1 : Math.min(radix, chars.length-1));
  return chars[Math.floor(Math.random() * validRadix)];
}


// Given an `id`, return an id which is guaranteed to be unique within the list of `otherIds`.
// Does this by tacking numbers on the end of the id (or increasing existing number on the end).
const ENDING_NUMBER_PATTERN = /^(.*?)(\d*)$/;
export function uniquifyId(id, otherIds) {
  if (!otherIds) return id;

  // if it's not in the list of `otherIds`, it's unique!
  if (!otherIds.includes(id)) return id;

  // otherwise tack a number onto the end
  let [ match, prefix, numericSuffix ] = id.match(ENDING_NUMBER_PATTERN);

  // convert numericSuffix to a number and increment, or go with "2"
  const suffix = parseInt(numericSuffix, 10) + 1 || 2;

  // recurse to make sure new id isn't in `otherIds`
  return uniquifyId(prefix + suffix, otherIds);
}


// Given an arbitrary string, convert to a legal javascript identifier
// by converting invalid identifier characters to underscores.
//
// TODO: remove illegal chars instead?
export const LEGAL_IDENTIFIER_START = /[^A-Za-z_\$]/;
export const LEGAL_IDENTIFIER_CHARS = /[^\w\$]/g;
export const LEGAL_IDENTIFIER_SPLITTER = /[_\$]/g;
export function normalizeIdentifier(identifier, defaultIdentifier) {
  if (!identifier || typeof identifier !== "string") {
    if (defaultIdentifier) return defaultIdentifier;

    console.warn(`normalizeIdentifier(${identifier}): illegal identifier, returning random id`);
    return generateRandomId();
  }

  return identifier[0].replace(LEGAL_IDENTIFIER_START, "_")
       + identifier.substr(1).replace(LEGAL_IDENTIFIER_CHARS, "_");
}

// Given an identifier, transform to a human-friendly string.
// By default we capitalize each segment, pass `capitalize=false` to skip this.
export function humanizeIdentifier(identifier = "", capitalize = true) {
  if (!identifier) return "";

  const split = identifier.split(LEGAL_IDENTIFIER_SPLITTER).filter(Boolean);
  if (capitalize) {
    return split.map( string => string[0].toUpperCase() + string.slice(1) )
            .join(" ");
  }
  return split.join(" ");
}

// Export all as one map
export default Object.assign({}, exports);

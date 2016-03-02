//////////////////////////////
//  ID Utility functions
//////////////////////////////

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


export const LEGAL_IDENTIFIER_START = /[^A-Za-z_\$]/;
export const LEGAL_IDENTIFIER_CHARS = /[^\w\$]/g;
export function normalizeIdentifier(identifier, defaultIdentifier) {
  if (!identifier || typeof identifier !== "string") {
    if (defaultIdentifier) return defaultIdentifier;

    console.warn(`normalizeIdentifier(${identifier}): illegal identifier, returning random id`);
    return generateRandomId();
  }

  return identifier[0].replace(LEGAL_IDENTIFIER_START, "_")
       + identifier.substr(1).replace(LEGAL_IDENTIFIER_CHARS, "_");
}


// Export all as one map
export default Object.assign({}, exports);

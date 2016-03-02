//////////////////////////////
//  ID Utility functions
//////////////////////////////

export const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
export const ALPHA_NUMERIC = "0123456789" + ALPHA;
export function generateRandomId(length = 6, radix = ALPHA_NUMERIC.length) {
  // make sure we don't start with a number so we're a legal identifier
  const letters = [ALPHA[Math.floor(Math.random() * radix)]];
  for (let i = 1; i < length; i++) {
    letters[i] = ALPHA_NUMERIC[Math.floor(Math.random() * radix)];
  }
  return letters.join("");
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

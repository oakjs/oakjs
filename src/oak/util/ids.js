//////////////////////////////
//  ID Utility functions
//////////////////////////////

export const ALPHA_NUMERIC = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
export function generateRandomId(length = 6, radix = ALPHA_NUMERIC.length) {
  const letters = [];
  for (let i = 0; i < length; i++) {
    letters[i] = ALPHA_NUMERIC[Math.floor(Math.random() * radix)];
  }
  return letters.join('');
}

// Export all methods as one object as well
export default exports;

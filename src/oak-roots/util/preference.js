//////////////////////////////
// Browser functionality
//////////////////////////////

import global from "./global";
import { removeFromLocalStorage } from "./browser";

// User preferences stored in localStorage
//
//  Simple "preferences" cover for localStorage.
//  Use this rather than writing to localStorage explicitly.
//    - Converts non-string values to/from strings automatically
//    - Doesn't fail in browsers where localStorage isn't defined (eg: Safari in 'safe browsing' mode).
//
//  eg: preference("foo", "bar")    <=== simple string set
//      preference("foo") === "bar"    <=== gives back value you put in.
//      preference("foo", null)      <=== clears the value and returns null.
//
//      preference("foo", [1,2,3])    <=== will JSONify results...
//      preference("foo") // == [1,2,3]  <=== you get an array back
//
export function preference(key, value) {
  // if exactly one argument, just return the current value.
  if (arguments.length === 1) {
    const storedValue = global.localStorage[key];
    if (storedValue !== undefined) {
      // convert from JSON if necessary
      try {
        return JSON.parse(storedValue);
      } catch (e) {
        console.error(`preference(${key}): error JSON.parsing value: `, storedValue);
      }
    }
    return storedValue;
  }
  // if 2 arguments, this is a set/clear
  else {
    // if value is null or undefined, clear the current value
    if (value == null) {
      removeFromLocalStorage(key);
    }
    // otherwise set the value, converting objects to a JSON string as necessary
    else {
      try {
        global.localStorage[key] = JSON.stringify(value);
      }
      catch (e) {
        console.error(`preference(${key}): Error JSON.stringifying value: `, value);
      }
      // return the value passed in
      return value;
    }
  }
}

// Wrapper to remove all keys from localStorage which start with a given prefix.
// Pass null to clear ALL prefs.
export function clearPrefs(prefix, skipDebugPrefs) {
  if (prefix == null) prefix = "";
  for (var key in global.localStorage) {
    if (key.startsWith(prefix)) {
      if (skipDebugPrefs && key.includes("__debug__")) continue;
      console.info("Clearing preference ",key);
      removeFromLocalStorage(key);
    }
  }
}


// Export all as one map
export default Object.assign({}, exports);

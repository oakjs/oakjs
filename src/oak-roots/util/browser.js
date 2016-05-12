//////////////////////////////
// Browser functionality
//////////////////////////////

import global from "./global";
import ids from "./ids";


// Create a stylesheet and install it if we're in the browser.
// If you pass an `id`, you can call this again to change the stylesheet later .
// Returns `false` if we're not in a browser.
// Otherwise returns the `id` (in case one was created).
export function createStylesheet(styles, id = "STYLE-"+ids.generateRandomId()) {
  if (typeof $ === "undefined") return false;

  const $sheet = "<style type='text/css' id="+id+">" + styles + "</style>";

  let $existing = $(`style#${id}`);
  if ($existing.length) {
    $existing.replaceWith($sheet);
  }
  else {
    $("head").append($sheet);
  }
  return id;
}

// Remove a stylesheet specified by id.
export function removeStylesheet(id) {
  $(`style#${id}`).remove();
}



// Make sure `localStorage` is defined.
// If not, we'll create a stub object for it,
// and things in localStorage will be forgotten on reload/etc.
if (!global.localStorage) {
  console.warn("localStorage is not defined!");
  global.localStorage = {};
}

// define "removeFromLocalStorage" (defined on some platforms like Safari)
export function removeFromLocalStorage(key) {
  if (typeof global.localStorage.removeItem === "function") {
    global.localStorage.removeItem(key);
  } else {
    delete global.localStorage[key];
  }
}

// Export all as one map
export default Object.assign({}, exports);

//////////////////////////////
// Browser functionality
//////////////////////////////

import ids from "./ids";


// Create a stylesheet and install it if we're in the browser.
// If you pass an `id`, you can call this again to change the stylesheet later .
// Returns `true` if we're in the browser and this works, otherwise returns `false`.
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
}

// Remove a stylesheet specified by id.
export function removeStylesheet(id) {
  $(`style#${id}`).remove();
}

// Export all as one map
export default Object.assign({}, exports);

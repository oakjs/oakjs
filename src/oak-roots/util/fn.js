//////////////////////////////
//  Function utilities
//////////////////////////////

// Debounce a `callback` so it's won't be called again until `delay` msec has passed.
// i.e. `callback` will be called once, `delay` msec after the last call
//      (or once at the beginning, if `immediate` is true).
export function debounce(callback, delay = 0, options) {
  // default options
  const immediate = (options && "immediate" in options ? options.immediate : false);
  const scope = (options && "scope" in options ? options.scope : window);

  let timeout;

  return function debounced(...args) {
    const callNow = immediate && !timeout;

    clearTimeout(timeout);
    timeout = setTimeout(function() {
      timeout = null;
      if (!immediate) callback.apply(scope, args);
    }, delay);

    if (callNow) callback.apply(scope, args);
  }
}

// Throttle a `callback` so it's called at most once per `delay` msec.
// i.e. `callback` will be called `N/delay` times where `N` is the number of calls.
export function throttle(callback, delay = 100, options = {}) {
  // default options
  const leading = (options && "leading" in options ? !!options.leading : true);
  const trailing = (options && "trailing" in options ? !!options.trailing : true);
  const scope = (options && "scope" in options ? options.scope : window);

  let timeout;
  let previousTime = 0;

  return function throttled(...args) {
    const now = Date.now();

    if (!previousTime && !leading) previousTime = now;
    const remaining = delay - (now - previousTime);

    if (remaining <= 0) {
      clearTimeout(timeout);
      timeout = null;
      previousTime = now;
      callback.apply(scope, args);
    }
    else if (!timeout && trailing !== false) {
      timeout = setTimeout(function() {
        previousTime = (leading ? Date.now() : 0);
        timeout = null;
        callback.apply(scope, args);
      }, remaining);
    }
  }
}


// Export all as one map
export default {...exports};

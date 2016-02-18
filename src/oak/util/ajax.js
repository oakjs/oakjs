//////////////////////////////
//  Fetch API cover routines
//////////////////////////////

const nativeFetch = (typeof window !== "undefined" ? window.fetch : global.fetch)
if (typeof nativeFetch === "undefined") {
  throw new ReferenceError("Expected HTML 'fetch' method to be defined.  You must install a polyfill, see: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch");
}

// Cover for HTML fetch routine which treats server errors as exceptions (failing the promise).
export function fetch(input, init) {
  return nativeFetch(input, init)
    .then( response => {
      // if we didn't get a successful response, throw!
      if (!response.ok) {
        const error = new Error(response.statusText);
        // add the response to the error so callers can examine it
        error.response = response;
        // note the error status specially
        error.status = response.status;
        throw error;
      }
      return response;
    });
}


// Fetch a text resource and return a promise which yields the text response.
export function fetchText(input, init = {}) {
  if (!init.headers) init.headers = new Headers({
		'Content-Type': 'text/plain'
	});
  return fetch(input, init)
    .then(response => response.text());
}


// Fetch a JSON resource and return a promise which yields the JSON response.
// If the response is malformed, throws an error.
export function fetchJSON(input, init = {}) {
  if (!init.headers) init.headers = new Headers({
		'Content-Type': 'application/json'
	});
  return fetch(input, init)
    .then(response => response.json());
}


// Fetch an optional text resource, returning an empty string if the file was not found.
export function fetchOptionalText(input, init = {}) {
  if (!init.headers) init.headers = new Headers({
		'Content-Type': 'text/plain'
	});

	return nativeFetch(input, init)
    .then(response => {
      if (response.ok) return response.text();
      if (response.status === 404) return undefined;

      const error = new Error(response.statusText);
      // add the response to the error so callers can examine it
      error.response = response;
      // note the error status specially
      error.status = response.status;
      throw error;
    });
}

// Export all as a map.
export default exports;


//////////////////////////////
//  API class
//
//  Create an instance of this and add all of your app-specific methods to it.
//
//  e.g.  FILE: app/api.js:
//          import API from "/util/API"
//          export default api = API({
//            fetchMyText(params) { return this.getText(`/api/some/path/${params.filename}/`) },
//            fetchMyJSON(params) { return this.getJSON(`/api/static/path/to/json/`) },
//            doSomethingCool(params, body) { return this.post(`/api/do/something/`, body) }
//          }
//
//        FILE: some/other/file.js:
//          import api from "./app/api"
//          ...
//          api.fetchMyText({ filename: "someFile.txt" });  << Returns a promise
//
//  You can also define API methods on the fly:
//        FILE: yet/another/file.js:
//          import api from "./app/api"
//          ...
//          api.doSomethingElse = function(params) { return this.get(`/some/path/blah`) }
//
//
//  If you need to massage the data after it comes back, do this by attaching a `then` handler to your method:
//          api.yetAnotherThing = function(params) {
//            return this.get("...")
//                    .then(result) { return applySomeTransform(result) }
//          }
//
//////////////////////////////


// TODO: use the fact that we know loading time to avoid reloading?
//  - can check controller.lastLoadTime and set If-Modified-Since header
//  - will have to process a 304 specially...

import objectUtil from "./util/object";

// Ensure that global `fetch` routine is present.
import global from "./util/global";
if (typeof global.fetch !== "function") {
  const message = "Expected global HTML 'fetch' method to be defined.  You must install a polyfill, see: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch";
  console.error(message);
  throw new ReferenceError(message);
}
const nativeFetch = global.fetch;

export default class API {
  constructor(props) {
    Object.assign(this, props);
  }

  //////////////////////////////
  // Fetch
  //////////////////////////////

  // Cover routine for standard Web `fetch` API which considers a non-200ish response an error.
  //
  // Note:  ALL API routines should eventually get down to this one method.
  //        This will allow us to batch requests to the server if desired.
  //
  // If you pass an `errorMessage`, we'll log any error found and re-throw it.
  fetch(url, fetchParams, errorMessage) {
    let promise = nativeFetch(url, fetchParams)
      .then(response => {
        if (!response.ok) {
          const error = new Error(response.statusText);
          // note the error status
          error.status = response.status;
          // add the response to the error so callers can examine it
          error.response = response;
          throw error;
        }
        return response;
      });

    // if we got an error message, catch and log any errors
    // but do NOT stop normal processing
    if (errorMessage) {
      promise = promise.catch(error => {
        this.logError({ errorMessage, error, url, fetchParams });
        throw error;
      });
    }

    return promise;
  }


  //////////////////////////////
  // Getters
  //////////////////////////////

  // Get a text resource at `url`.
  // Returns a promise which yields the reponse as a text string.
  // If you pass an `errorMessage`, we'll log any error found and re-throw it.
  getText(url, fetchParams, errorMessage) {
    return this.fetch(url, fetchParams, errorMessage)
            .then(response => {
              return response.text()
                .catch(error => {
                  this.logError({ errorMessage, error, detail: "Error extracting text from response", url, fetchParams, response });
                  throw error;
                });
            });
  }

  // Get a JSON resource at `url`.
  // Returns a promise which yields the reponse as a json object.
  // Throws if the json is not valid.
  // If you pass an `errorMessage`, we'll log any error found and re-throw it.
  getJSON(url, fetchParams, errorMessage) {
    return this.fetch(url, fetchParams, errorMessage)
            .then(response => {
              return response.json()
                .catch(error => {
                  this.logError({ errorMessage, error, detail: "Error parsing JSON from response", url, fetchParams, response });
                  throw error;
                });
            })
  }

  //////////////////////////////
  // Posters
  //////////////////////////////

  // Post something to the server at `url`.
  // If `body` is not a string, we'll `JSON.strigify()` it.
  //
  // Throws and logs to console if if `JSON.stringify()` fails.
  post(url, body, fetchParams = {}, errorMessage) {
    if (!fetchParams.method) fetchParams.method = "POST";
    if (body != null) {
      if (typeof body === "string") fetchParams.body = body;
      else {
        try {
          fetchParams.body = JSON.stringify(body);
        }
        catch (error) {
          error.detail = "Error JSON.stringifying body";
          const message = errorMessage || "Error posting to the server";
          this.logError({ errorMessage: message, error, url, fetchParams, body });
          return Promise.reject(error);
        }
      }
    }
    return this.fetch(url, fetchParams, errorMessage);
  }


  //////////////////////////////
  //  Utilities
  //////////////////////////////

  // Set a header in a `fetchParams`.
  // Works if we have a header or not, if header has a `set` or not.
  setHeader(fetchParams = {}, headerName, value) {
    if (!fetchParams.headers) fetchParams.headers = {};
    if (fetchParams.headers.set) {
      fetchParams.headers.set(headerName, value);
    }
    else {
      fetchParams.headers[headerName] = value;
    }
    return fetchParams;
  }

  // Given a timestamp and a possible fetchParams object,
  //  add the timestamp as a `If-Modified-Since` header
  addModifiedHeader(fetchParams, timestamp) {
    const serverTimestamp = this.getTimestampForServer(timestamp);
    if (serverTimestamp) this.setHeader(fetchParams, "If-Modified-Since", serverTimestamp);
    return fetchParams;
  }

  // Parse a timestamp into a date given:
  //  - a `Date`
  //  - a timestamp in msec, or
  //  - a date string
  // Returns `undefined` if we can't figure it out.
  parseTimestamp(timestamp) {
    let date = timestamp;
    if (typeof timestamp === "number") date = new Date(timestamp);
    else if (typeof timestamp === "string") date = Date.parse(timestamp);
    if (date instanceof Date && isFinite(date)) return date;
    return undefined;
  }

  // Given:  a `Date`, a timestamp in msec or a date string
  //  return a timestamp as the server expects it.
  // Returns `undefined` if we can't figure it out.
  getTimestampForServer(timestamp) {
    const date = this.parseTimestamp(timestamp);
    if (date) return date.toUTCString();
    return undefined;
  }

  // Given a map of `{ key: loadingPromise }`,
  //  return a Promise which resolves to `{ key: result }`
  map(map) {
    const keys = Object.keys(map);
    const promises = objectUtil.values(map);
    return Promise.all(promises)
      .then(results => {
        const map = {};
        results.forEach((result, index) => map[keys[index]] = result);
        return map;
      });
  }

  // Log a response or other error
  logError({errorMessage, error, ...params}) {
    console.group(errorMessage);
    console.error(error);
    for (let key in params) {
      console.log(key+":", params[key]);
    }
    for (let key in error) {
      console.log(key+":", error[key]);
    }
    console.groupEnd();
  }


  // Return the content type specified in a `response`, `request` or `fetchParams` object.
  static getContentType(response) {
    const headers = response && response.headers;
    if (!headers) return undefined;
    if (headers.get) return headers.get("Content-Type");
    return headers["Content-Type"];
  }

}

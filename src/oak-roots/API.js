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

import global from "./util/global";
if (typeof global.fetch !== "function") {
  const message = "Expected global HTML 'fetch' method to be defined.  You must install a polyfill, see: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch";
  console.error(message);
  throw new ReferenceError(message);
}

const nativeFetch = global.fetch;

export default class API {

  //////////////////////////////
  // Fetch
  //////////////////////////////

  // Cover routine for standard Web `fetch` API which considers a non-200ish response an error.
  //
  // Note:  ALL API routines should eventually get down to this one method.
  //        That allows us to batch requests to the server if desired.
  //
  fetch(path, fetchParams) {
    return nativeFetch(path, fetchParams)
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
  }


  //////////////////////////////
  // Getters
  //////////////////////////////

  // Get a text resource at `path`.
  // Returns a promise which yields the reponse as a text string.
  getText(path, fetchParams) {
    return this.fetch(path, fetchParams).then(response => response.text());
  }

  // Get a JSON resource at `path`.
  // Returns a promise which yields the reponse as a json object.
  // Throws if the json is not valid.
  getJSON(path, fetchParams) {
    return this.fetch(path, fetchParams).then(response => response.json());
  }

  // Get resource at `path` returning appropriate result type:
  //    Content-Type          Returned
  //    --------------------|---------------------
  //    "application/json"  | `response.json()`
  //    (anything else)     | `response.text()`
  //
  get(path, fetchParams) {
    return API.fetch(input, fetchParams)
      .then(response => {
        // Figure out the content type:
        //  - if they specific an explicit type in the fetchParams, use that
        //  - otherwise trust what the server told us
        const contentType = API.getContentType(fetchParams) || API.getContentType(response);
        switch (contentType) {
          case "application/json":  return response.json();
          // TODO...
          default:                  return response.text();
        }
      });
  }

  //////////////////////////////
  // Posters
  //////////////////////////////

  // Post something to the server at `path`.
  // If `body` is not a string, we'll `JSON.strigify()` it.
  //
  // Throws and logs to console if if `JSON.stringify()` fails.
  post(path, body, fetchParams = {}) {
    if (!fetchParams.method) fetchParams.method = "POST";
    if (body != null) {
      if (typeof body === "string") fetchParams.body = body;
      else {
        try {
          fetchParams.body = JSON.stringify(body);
        }
        catch (error) {
          console.group(`api.post(): error converting json to string`);
          console.error(error);
          conosle.log("body: ", body);
          console.groupEnd();

          return Promise.reject(error);
        }
      }
    }
    return this.fetch(path, fetchParams);
  }


  //////////////////////////////
  //  Utilities
  //////////////////////////////

  // Return the content type specified in a `response`, `request` or `fetchParams` object.
  static getContentType(response) {
    const headers = response && response.headers;
    if (!headers) return undefined;
    if (headers.get) return headers.get("Content-Type");
    return headers["Content-Type"];
  }

}

import "babel-core/external-helpers";
import { expect } from "chai";

import Component from "../src/oak/Component";

// Set up mock redux store
import { combineReducers, createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import configureMockStore from "redux-mock-store";
const mockStore = configureMockStore([ thunk ]);

const reducers = combineReducers({
  projectMap: Component.reducer
});


// Make sure bootstrap worked...
describe("The Component module", () => {
  var store;
  // Create a new store and assign it to Component before each test
  beforeEach(()=> {
    store = Component.store = createStore(reducers);
  });

  it("has all of the expected bits", () => {
    expect(Component).to.be.a("function");
    expect(Component.reducer).to.be.a("function");
    expect(Component.actions).to.be.an("object");
  });

  it("gets projectMap properly", () => {
    expect(Component.projectMap).to.be.an("object");
    expect(Component.projectMap).to.be.empty;
  });

  it("joins paths as expected", () => {
    expect(Component.joinPath(undefined, "foo")).to.equal("/foo");
    expect(Component.joinPath("/", "foo")).to.equal("/foo");
    expect(Component.joinPath("/foo", "bar")).to.equal("/foo/bar");
  });

  it("splits paths as expected", () => {
    expect(Component.splitPath("/")).to.deep.equal([ undefined, "/"]);
    expect(Component.splitPath("/foo")).to.deep.equal([ "/", "foo"]);
    expect(Component.splitPath("/foo/bar")).to.deep.equal([ "/foo", "bar"]);
  });

  it("does getParentPath() correctly", () => {
    expect(Component.getParentPath("/")).to.equal(undefined);
    expect(Component.getParentPath("/foo")).to.equal("/");
    expect(Component.getParentPath("/foo/bar")).to.equal("/foo");
  })
});


// Configure component reducers
describe("Component reducers", () => {
  var store;

  // Create a new store and assign it to Component before each test
  beforeEach(()=> {
    store = Component.store = createStore(reducers, applyMiddleware(thunk));
  });

  it("have store properly set up to start", () => {
    expect(Component.store).to.exist;
    const state = store.getState();
    expect(state).to.be.an("object");
    expect(state.projectMap).to.be.an("object");
    expect(state.projectMap).to.be.empty;
  })

  it("the LOAD_ACCOUNT reducer works as expected for Account", () => {
    const path = Component._ACCOUNT_PATH_;
    const loadPromise = Promise.resolve();

    store.dispatch({ type: "LOAD_ACCOUNT", path, loadPromise });

    const { projectMap } = store.getState();

    // same shape
    const mapData = { [path] : { path, type: "Account", loadState: loadPromise } };
    expect(projectMap).to.deep.equal(mapData)
    // instance of Component
    const account = projectMap[path];
    expect(account).to.be.an.instanceof(Component);
    // same object when we do Component.get()
    expect(account).to.equal(Component.get(path));
    expect(account).to.equal(Component.get(path, projectMap));
    // same object when we do `Component.getAccount()`
    expect(account).to.equal(Component.getAccount());
    expect(account).to.equal(Component.getAccount(projectMap));
    // load state
    expect(account.isUnloaded).to.be.false;
    expect(account.isLoading).to.be.true;
    expect(account.isLoaded).to.be.false;
    expect(account.isLoadError).to.be.false;
    // toJSON
    const accountJSON = { path, type: "Account", loadState: "loading" };
    expect(account.toJSON()).to.deep.equal(accountJSON);
  });

  it("the LOADED_ACCOUNT reducer works as expected for Account", () => {
    const path = Component._ACCOUNT_PATH_;
    const data = {
      index: [ { id: "foo", type: "Page", title: "FOOO" } ]
    };
    store.dispatch({ type: "LOAD_ACCOUNT", path });
    const originalAccount = Component.get(path);

    store.dispatch({ type: "LOADED_ACCOUNT", path, data });

    const { projectMap } = store.getState();
    const newAccount = projectMap[path];
    // make sure account has changed
    expect(newAccount).to.not.equal(originalAccount);

    // account object set up
    const accountData = { path, type: "Account", loadState: "loaded", index: [ "foo" ] };
    expect(newAccount).to.deep.equal(accountData);
    expect(newAccount.toJSON()).to.deep.equal(accountData);

    expect(newAccount.isUnloaded).to.be.false;
    expect(newAccount.isLoading).to.be.false;
    expect(newAccount.isLoaded).to.be.true;
    expect(newAccount.isLoadError).to.be.false;

    // project is of correct shape
    const projectData = { path: "/foo", type: "Page", title: "FOOO" };
    const project = projectMap["/foo"];

    expect(project).to.deep.equal(projectData);
    expect(project).to.be.an.instanceof(Component);
  });

  it("the LOAD_COMPONENT_ERROR reducer works as expected for Account", () => {
    const path = Component._ACCOUNT_PATH_;
    const data = {
      index: [ { id: "foo", type: "Page", title: "FOOO" } ]
    };
    store.dispatch({ type: "LOAD_ACCOUNT", path });
    const originalAccount = Component.get(path);

    store.dispatch({ type: "LOAD_ACCOUNT_ERROR", path, error: "OOPS" });

    const { projectMap } = store.getState();
    const newAccount = projectMap[path];
    // make sure account has changed
    expect(newAccount).to.not.equal(originalAccount);

    // account object set up
    const accountData = { path, type: "Account", loadState: new Error("OOPS") };
    expect(newAccount).to.deep.equal(accountData);
  });

});

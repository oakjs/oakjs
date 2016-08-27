//////////////////////////////
//  Higher-order Compponent class which manages storing "preference" values for the user
//  in `localStorage` or `sessionStorage`, reflecting those values into `component.state`.
//
//
//  To persist state variables for this component instance:
//  // wrap your constructor in Preferential:
//      class MyComponent extends Preferential(React.Component) {
//    // implement `getPrefId()`
//        getPrefId(props) { return `some-unique-pref-name-for${props.id}` }
//
//    // implement `getDefaultPrefs()` if desired
//        getDefaultPrefs(props) { return { somePref: 1 } }
//
//    // use `state.somePref` to get the current value from the pref
//      TODO: example
//
//    // use `savePrefs(deltas)` to save changes to the pref and update localStorage
//      TODO: example
//
//////////////////////////////

import React, { PropTypes } from "react";

export default function PreferentialComponent(Component = React.Component) {


  return class Preferential extends Component {
    // Where do we store the prefs?  `localStorage` or `sessionStorage`???
    static storage = sessionStorage;

    // On construction, load prefs and apply to `component.state`.
    constructor(props) {
      super(props);
      // load prefs and apply to state
      const prefs = this.loadPrefs(props);
      if (prefs) this.state = { ...this.state, prefs };
    }

    // When `props` change, apply new preferences.
    componentWillReceiveProps(nextProps) {
      // call super method only if defined
      if (Component.prototype.componentWillReceiveProps) this.super(nextProps);

      const prefs = this.loadPrefs(nextProps);
      if (prefs) this._savePrefs(prefs);
    }

    // Return the `id` that we'll use to store our prefs object.
    // Note that ALL COMPONENTS that share this `id` ON ALL PAGES will have the same prefs!
    getPrefId(props = this.props) {}

    // Load prefs from localStorage according to `props` passed in.
    loadPrefs(props = this.props) {
      const id = this.getPrefId(props);
      const storage = this.constructor.storage;
      if (id && id in storage) return JSON.parse(storage[id]);
      return this.getDefaultPrefs(props);
    }

    // Return FULL default prefs object for specified `props`.
    getDefaultPrefs(props) {
      return undefined;
    }

    // Save preference deltas.  Applies in shallow copy over current prefs.
    savePrefs(deltas) {
      if (!deltas || Object.keys(deltas).length === 0) return;
      const fullPrefs = { ...this.loadPrefs(this.props), ...deltas };
      return this._savePrefs(fullPrefs);
    }

    // Internal routine to save FULL value of `prefs`, no mixing with current prefs.
    _savePrefs(fullPrefs) {
      const id = this.getPrefId(this.props);
      if (id) {
        const storage = this.constructor.storage;
        storage[id] = JSON.stringify( fullPrefs );
      }

      // set state with the deltas so we'll redraw
      this.setState(fullPrefs);
    }

  }
}

include React, { PropTypes } from "react";

// Given a generic stateful component which normally deals with state internally,
// switch it to get/set its state from a global `app state`.
//
// This is completely transparent to the implementing object,
//  it just uses `this.state.x` and `this.setState({ key: value })` as normal.
//
// To opt in to this global state behavior:
//  - When initializng your component, pass it a unique `appStateId` property.
//
//    NOTE: this implementation assumes that the `appStateId` will not change
//          for a mounted component.  If dynamically changing this is necessary,
//          we could make it work with some additional complexity in this file.
//
// ASSUMES:
//  - the enclosing ("application") component passes the following two methods
//    as `context` to all descendent objects:
//
//    - `getAppState(appStateId)`
//        - Returns the application state associated with this `appStateId`
//
//    - `setAppState(appStateId, newState)`
//        - Merges `newState` with the current application state
//          associated with `appStateId`, then forces a redraw of the application.
//

export default function wrapStatefulComponentInAppState(Component) {
  // Create the wrapper class.
  class AppStateComponent extends Component {
    // Add `appStateId` to our known set of properties.
    static propTypes = {
      ...Component.propTypes,
      appStateId: PropTypes.string
    };

    // Pick up `getAppState` and `setAppState` from context.
    static contextTypes = {
      ...Component.contextTypes,
      getAppState: PropTypes.func.isRequired,
      setAppState: PropTypes.func.isRequired,
    };

    constructor() {
      super(...props);

      const { appStateId } = this.props;
      if (appStateId) {
        // if we have any initial state, push that up into the global context
        if (this.state) this.context.setAppState(appStateId, this.state);

        Object.defineProperties(this, {
          // Take over our `state` variable to look in the global app state.
          state: {
            get: () => this.context.getAppState(appStateId)
          },

          // Take over our `setState` method to set the value in the global app state.
          setState: {
            value: (newState) => this.context.setAppState(appStateId, newState)
          }
        });
      }
    }
  }
  return AppStateComponent;
}

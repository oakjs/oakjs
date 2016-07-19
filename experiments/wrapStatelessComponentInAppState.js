include React, { PropTypes } from "react";

export default function wrapStatelessCompnentInAppState(statelessComponent) {
  function WrappedComponent(props, context) {
    const { appStateId } = props;

    if (appStateId) {
      const mergedProps = Object.assign({}, props, context.getAppState(appStateId));
      return statelessComponent(mergedProps, context);
    }
    else {
      return statelessComponent(props, context);
    }
  }
}

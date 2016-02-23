import React, { PropTypes } from "react";
import Stub from "./Stub";

export default function CurrentStack(props, context) {
console.warn("CurrentStack", context);
  const stack = context.app.stack;
  if (!stack) return <Stub/>;
  return React.createElement(stack.ComponentConstructor);
}

CurrentStack.contextTypes = {
  app: PropTypes.any,
}

import React from "react";
import Stub from "./Stub";

export default function CurrentStack(props, context) {
  const stack = context.app.stack;
  if (!stack) return <Stub/>;
  return React.createElement(stack.ComponentConstructor);
}

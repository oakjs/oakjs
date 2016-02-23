import React, { PropTypes } from "react";
import Stub from "./Stub";

export default function CurrentCard(props, context) {
  const card = context.app.card;
  if (!card) return <Stub/>;
  return React.createElement(card.ComponentConstructor);
}

CurrentCard.contextTypes = {
  app: PropTypes.any,
}

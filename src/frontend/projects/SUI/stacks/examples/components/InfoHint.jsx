import React, { PropTypes } from "react";

function InfoHint(props, context) {
  const { Icon, Popup } = context.stack.components;
  return (
    <span style={{cursor:"pointer", marginLeft:10}}>
      <Icon circular icon="info" appearance="tiny blue inverted"/>
      <Popup {...props}/>
    </span>
  );
}

// Pull context in so we can get components from the stack.
InfoHint.contextTypes = {
  project: PropTypes.any,
  stack: PropTypes.any,
  card: PropTypes.any
};

// Add `render` method so we'll get hot reload
InfoHint.render = Function.prototype;

export default InfoHint;

import React, { PropTypes } from "react";

function InfoHint(props, context) {
  const c = context.components;
  return (
    <span style={{cursor:"pointer", marginLeft:10}}>
      <c.Icon circular icon="info" appearance="tiny grey inverted"/>
      <c.Popup appearance="very wide" {...props}/>
    </span>
  );
}

// Pull context in so we can get components.
InfoHint.contextTypes = {
  components: PropTypes.any,
};

// Add `render` method so we'll get hot reload
InfoHint.render = Function.prototype;

export default InfoHint;

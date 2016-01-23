import React, { PropTypes } from "react";

import InfoHint from "./InfoHint";

function Example(props, context) {
  const { Header, Popup, Spacer } = context.stack.components;
  return (
    <div className="example">
      <Spacer size="small"/>
      <Header size="medium">
        {props.title}
        {props.hint && <InfoHint text={props.hint}/>}
      </Header>
      {props.children}
    </div>
  );
}

// Pull context in so we can get components from the stack.
Example.contextTypes = {
  project: PropTypes.any,
  stack: PropTypes.any,
  card: PropTypes.any
};

// Add `render` method so we'll get hot reload
Example.render = Function.prototype;

export default Example;

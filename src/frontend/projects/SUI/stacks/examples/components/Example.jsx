import React, { PropTypes } from "react";
import classNames from "classnames";

import InfoHint from "./InfoHint";

import "./Example.css";

function Example(props, context) {
  const { appearance, title, hint, children, } = props;
  const c = context.components;
  const className = classNames("Example", appearance);
  return (
    <div className={className}>
      <c.Spacer size="small"/>
      <c.Header size="medium" dividing>
        {title}
        {hint && <c.InfoHint text={hint}/>}
      </c.Header>
      {children}
      <c.Spacer size="huge"/>
    </div>
  );
}

// Pull context in so we can get components from the stack.
Example.contextTypes = {
  components: PropTypes.any,
};

// Add `render` method so we'll get hot reload
Example.render = Function.prototype;

export default Example;

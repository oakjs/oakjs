import React, { PropTypes } from "react";
import classNames from "classnames";

import InfoHint from "./InfoHint";
import "./Example.css";

function Example(props, context) {
  const { appearance, title, hint, compact, columns, children, } = props;
  const c = context.components;
  const columnClass = (columns ? [c.SUI.getColumnWidthClass(columns), "column", "unpadded"] : undefined);
  const className = classNames("Example", appearance, columnClass);

  const infoHint = hint && <c.InfoHint content={hint}/>;
  const header = (title ? <c.Header size="medium" dividing>{title}{infoHint}</c.Header> : undefined);

  return (
    <div className={className}>
      <c.Spacer/>
      {header}
      {children}
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

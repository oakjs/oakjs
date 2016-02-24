import React, { PropTypes } from "react";
import { classNames } from "oak-roots/util/react";

import "./Example.css";

function Example(props, { components: c }) {
  const {
    title, hint,
    className, appearance, compact, columns,
    children,
    ...divProps
  } = props;

  divProps.className = classNames(
      className, appearance,
//      (columns ? [c.SUI.getColumnWidthClass(columns), "column", "unpadded"] : undefined),
      "Example"
  );

  const infoHint = hint && <c.InfoHint content={hint}/>;
  const header = (title ? <c.Header size="medium" dividing>{title}{infoHint}</c.Header> : undefined);

  return (
    <div {...divProps}>
      {header}
      <c.Spacer/>
      {children}
      <c.Spacer massive/>
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

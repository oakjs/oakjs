import React, { PropTypes } from "react";
import classNames from "classnames";

function Section(props, context) {
  const c = context.components;
  const { title, children, ...segmentProps } = props;
  segmentProps.appearance = classNames(props.appearance, "basic");
  return (
    <c.Segment appearance="basic very padded">
      <c.Header size="large" dividing>
        {title}
      </c.Header>
      <c.Segment {...segmentProps}>
        {children}
      </c.Segment>
    </c.Segment>
  );
}

// Pull context in so we can get components from the stack.
Section.contextTypes = {
  components: PropTypes.any,
};

// Add `render` method so we'll get hot reload
Section.render = Function.prototype;

export default Section;

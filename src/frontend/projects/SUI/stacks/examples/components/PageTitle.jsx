import React, { PropTypes } from "react";

function PageTitle(props, context) {
  const c = context.components;
  const { title, children } = props;
  return (
    <c.Segment appearance="basic unpadded">
      <c.Segment appearance="basic very padded">
        <c.Header size="huge">
          {title}
          <c.SubHeader>
            {children}
          </c.SubHeader>
        </c.Header>
      </c.Segment>
      <c.Divider/>
    </c.Segment>
  );
}

// Pull context in so we can get components from the stack.
PageTitle.contextTypes = {
  components: PropTypes.any,
};

// Add `render` method so we'll get hot reload
PageTitle.render = Function.prototype;

export default PageTitle;

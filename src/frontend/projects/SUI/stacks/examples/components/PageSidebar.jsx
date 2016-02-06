import React, { PropTypes } from "react";

function PageSidebar(props, context) {
  const c = context.components;
  return (
    <c.Sidebar visible side="left" dimPage={false} appearance="inverted vertical sticky menu">
      <c.MenuHeader>Components</c.MenuHeader>
      <c.StackMenu appearance="inverted vertical"/>
    </c.Sidebar>
  );
}

// Pull context in so we can get components from the stack.
PageSidebar.contextTypes = {
  components: PropTypes.any,
};

// Add `render` method so we'll get hot reload
PageSidebar.render = Function.prototype;

export default PageSidebar;

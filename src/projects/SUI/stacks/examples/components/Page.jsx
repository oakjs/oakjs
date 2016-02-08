import React, { PropTypes } from "react";

function Page(props, context) {
  const c = context.components;
  return (
    <c.Pusher className="Page">
      {props.children}
    </c.Pusher>
  );
}

// Pull context in so we can get components.
Page.contextTypes = {
  components: PropTypes.any,
};

// Add `render` method so we'll get hot reload
Page.render = Function.prototype;

export default Page;

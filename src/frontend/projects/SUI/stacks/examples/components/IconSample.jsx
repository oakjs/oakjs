import React, { PropTypes } from "react";

import "./IconSample.css";

function IconSample(props, context) {
  const c = context.components;
  return (
    <div className="IconSample one column">
      <c.Icon icon={props.icon}/>
      <div className='title'>{props.icon}</div>
    </div>
  );
}

// Pull context in so we can get components from the stack.
IconSample.contextTypes = {
  components: PropTypes.any,
};

// Add `render` method so we'll get hot reload
IconSample.render = Function.prototype;

export default IconSample;

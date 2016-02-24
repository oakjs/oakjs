import React, { PropTypes } from "react";
import { classNames } from "oak-roots/util/react";

function Warning(props, context) {
  const { components:c } = context;

  return <c.Message icon="small warning sign" size="small" appearance="warning" {...props}/>
}

// Pull context in so we can get components.
Warning.contextTypes = {
  components: PropTypes.any,
};

export default Warning;

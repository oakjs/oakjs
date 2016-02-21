import React, { PropTypes } from "react";
import classNames from "oak-roots/util/react";

function Bug(props, context) {
  const { components:c } = context;

  return <c.Message icon="small bug" size="small" appearance="error" {...props}/>
}

// Pull context in so we can get components.
Bug.contextTypes = {
  components: PropTypes.any,
};

export default Bug;

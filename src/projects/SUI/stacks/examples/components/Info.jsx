import React, { PropTypes } from "react";
import classNames from "classnames";

function Info(props, context) {
  const { components:c } = context;

  return <c.Message icon="small info circle" size="small" appearance="info" {...props}/>
}

// Pull context in so we can get components.
Info.contextTypes = {
  components: PropTypes.any,
};

export default Info;

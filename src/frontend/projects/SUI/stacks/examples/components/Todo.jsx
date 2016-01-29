import React, { PropTypes } from "react";
import classNames from "classnames";

function Todo(props, context) {
  const { components:c } = context;

  return <c.Message icon="small checkmark" size="small" appearance="success" header="TODO:" {...props}/>
}

// Pull context in so we can get components.
Todo.contextTypes = {
  components: PropTypes.any,
};

export default Todo;

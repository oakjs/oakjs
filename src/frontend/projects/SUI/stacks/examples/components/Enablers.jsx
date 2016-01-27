import React, { PropTypes } from "react";
import classNames from "classnames";

function Enablers(props, context) {
  const c = context.components;

  // id of the thing we're enabling/disabling
  const { id } = props;

  const messageId = `${id}-message`;
  function set(property, state) {
    return () => {
      c.Message.set(messageId, {message:" "})();
      c.Dimmer.set(id, {[property]: state})();
    }
  }

  return (
    <c.Segment appearance="basic">
      <c.Buttons>
        <c.Button title="Show" onClick={set("visible", true)}/>
        <c.Button title="Hide" onClick={set("visible", false)}/>
      </c.Buttons>
      <c.Spacer inline/>
      <c.Buttons>
        <c.Button title="Enable" onClick={set("disabled", false)}/>
        <c.Button title="Disable" onClick={set("disabled", true)}/>
      </c.Buttons>
      <c.Message id={`${id}-message`} message=" " floated="right"/>
    </c.Segment>
  )
}

// Pull context in so we can get components.
Enablers.contextTypes = {
  components: PropTypes.any,
};

// Add `render` method so we'll get hot reload
Enablers.render = Function.prototype;

export default Enablers;

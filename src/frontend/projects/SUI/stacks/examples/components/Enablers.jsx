import React, { PropTypes } from "react";
import classNames from "classnames";

function Enablers(props, context) {
  const { components:c, card } = context;

  // id of the thing we're enabling/disabling
  const { "for":ref, floated, visibleOnly, enabledOnly } = props;

  const elements = new c.ElementBuffer({
    type: "div",
    props: {
      style: {}
    }
  });
  if (floated) elements.setStyle("float", floated);

  if (!enabledOnly) {
    elements.append(
      <c.Buttons>
        <c.Button title="Show" onClick={() => card.refs[ref].visible = true}/>
        <c.Button title="Hide" onClick={() => card.refs[ref].visible = false}/>
      </c.Buttons>,
      <c.Spacer inline/>
    );
  }

  if (!visibleOnly) {
    elements.append(
      <c.Buttons>
        <c.Button title="Enable" onClick={() => card.refs[ref].disabled = false}/>
        <c.Button title="Disable" onClick={() => card.refs[ref].disabled = true}/>
      </c.Buttons>,
      <c.Spacer inline/>
    );
  }
  return elements.render();
}

// Pull context in so we can get components.
Enablers.contextTypes = {
  card: PropTypes.any,
  components: PropTypes.any,
};

// Add `render` method so we'll get hot reload
Enablers.render = Function.prototype;

export default Enablers;

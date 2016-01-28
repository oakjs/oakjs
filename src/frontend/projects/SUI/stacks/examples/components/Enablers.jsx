import React, { PropTypes } from "react";
import classNames from "classnames";

function Enablers(props, context) {
  const c = context.components;
  const card = context.card;

  // id of the thing we're enabling/disabling
  const { forId, visibleOnly, enabledOnly } = props;

  function get(property) {
    return card.getData(forId+"."+property);
  }

  function set(property, value) {
    return () => {
      card.setData(forId+".message", "");
      card.setData(forId+"."+property, value)
    }
  }

  function renderVisibles() {
    if (!enabledOnly) return (
      <c.Buttons>
        <c.Button title="Show" onClick={set("visible", true)} active={get("visible")}/>
        <c.Button title="Hide" onClick={set("visible", false)} active={!get("visible")}/>
      </c.Buttons>
    );
  }

  function renderEnablers() {
    if (!visibleOnly) return (
      <c.Buttons>
        <c.Button title="Enable" onClick={set("disabled", false)} active={!get("disabled")}/>
        <c.Button title="Disable" onClick={set("disabled", true)} active={get("disabled")}/>
      </c.Buttons>
    );
  }

  return (
    <c.Segment appearance="basic">
      {renderVisibles()}
      <c.Spacer inline/>
      {renderEnablers()}
      <c.Spacer inline/>
      <c.Label content={get("message", "")} appearance="transparent"/>
    </c.Segment>
  )
}

// Pull context in so we can get components.
Enablers.contextTypes = {
  card: PropTypes.any,
  components: PropTypes.any,
};

// Add `render` method so we'll get hot reload
Enablers.render = Function.prototype;

export default Enablers;

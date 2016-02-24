export default class Enablers extends oak.CustomComponent {
  render() {
    const { components:c, card } = this.context;

    // id of the thing we're enabling/disabling
    const { "for":ref, visibleOnly, enabledOnly } = this.props;

    // get result and setting from the card data
    const result = card.get(ref+".result");

    function getDefaultMessage(newState) {
      const properties = []
      for (let property in newState) {
        properties.push(property + " to " + JSON.stringify(newState[property]));
      }
      return "Set " + properties.join(" and ");
    }

    const elements = new c.ElementBuffer({
      type: c.Segment,
      props: {
        appearance: "basic unpadded"
      }
    });

    elements.append(
      <div style={{float:"right", textAlign:"right", fontWeight:"bold"}}>
        {result}
        {result && <c.Button appearance="transparent" icon="close" onClick={card.deferredSet(ref+".result", "")}/>}
      </div>
    );

    if (!enabledOnly) {
      elements.append(
        <c.Buttons>
          <c.Button title="Show" onClick={card.deferredSet(ref+".visible", true)}/>
          <c.Button title="Hide" onClick={card.deferredSet(ref+".visible", false)}/>
        </c.Buttons>,
        <c.Spacer inline/>
      );
    }

    if (!visibleOnly) {
      elements.append(
        <c.Buttons>
          <c.Button title="Enable" onClick={card.deferredSet(ref+".disabled", false)}/>
          <c.Button title="Disable" onClick={card.deferredSet(ref+".disabled", true)}/>
        </c.Buttons>,
        <c.Spacer inline/>
      );
    }

    return elements.render();
  }
}

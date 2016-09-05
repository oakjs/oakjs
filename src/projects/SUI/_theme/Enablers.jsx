const { OakComponent } = oak.components.Oak;
export default class Enablers extends OakComponent {
  render() {
    const { page } = this.context;
    const { Oak, SUI } = this.context.components;

    // id of the thing we're enabling/disabling
    const { "for":ref, visibleOnly, enabledOnly } = this.props;

    // get result and setting from the page data
    const result = page.get(ref+".result");

    function getDefaultMessage(newState) {
      const properties = []
      for (let property in newState) {
        properties.push(property + " to " + JSON.stringify(newState[property]));
      }
      return "Set " + properties.join(" and ");
    }

    const elements = new SUI.ElementBuffer({
      type: SUI.Segment,
      props: {
        appearance: "basic unpadded"
      }
    });

    elements.append(
      <div style={{float:"right", textAlign:"right", fontWeight:"bold"}}>
        {result}
        {result && <SUI.Button appearance="transparent" icon="close" onClick={page.deferredSet(ref+".result", "")}/>}
      </div>
    );

    if (!enabledOnly) {
      elements.append(
        <SUI.Buttons>
          <SUI.Button title="Show" onClick={page.deferredSet(ref+".visible", true)}/>
          <SUI.Button title="Hide" onClick={page.deferredSet(ref+".visible", false)}/>
        </SUI.Buttons>,
        <Oak.Spacer inline/>
      );
    }

    if (!visibleOnly) {
      elements.append(
        <SUI.Buttons>
          <SUI.Button title="Enable" onClick={page.deferredSet(ref+".disabled", false)}/>
          <SUI.Button title="Disable" onClick={page.deferredSet(ref+".disabled", true)}/>
        </SUI.Buttons>,
        <Oak.Spacer inline/>
      );
    }

    return elements.render();
  }
}


import { editify } from "oak/EditorProps";
editify({ droppable: false }, Enablers);

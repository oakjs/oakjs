import React, { PropTypes } from "react";
import classNames from "classnames";


class Enablers extends React.Component {

  // Pull context in so we can get components.
  static contextTypes = {
    card: PropTypes.any,
    components: PropTypes.any,
  };

  get result() { return this.state && "result" in this.state ? this.state.result : this.props.result }
  set result(value) { this.setState({ result: value }) }

  get setting() { return this.state && "setting" in this.state ? this.state.setting : this.props.setting }
  set setting(value) { this.setState({ setting: value }) }

  render() {
    const { components:c, card } = this.context;

    // id of the thing we're enabling/disabling
    const { "for":ref, visibleOnly, enabledOnly } = this.props;
    const { result, setting } = this;

    function getDefaultMessage(newState) {
      const properties = []
      for (let property in newState) {
        properties.push(property + " to " + JSON.stringify(newState[property]));
      }
      return "Set " + properties.join(" and ");
    }

    // return a function which sets a value and shows some message
    const setComponent = (newState) => {
      return () => {
        this.result = "";
        this.setting = getDefaultMessage(newState);

        const component = card.refs[ref];
        // use `set` if it's defined
        if (component.set)  component.set(newState);
        else                component.setState(newState);
      }
    }

    const elements = new c.ElementBuffer({
      type: c.Segment,
      props: {
        appearance: "basic unpadded"
      }
    });

    elements.append(
      <div style={{float:"right", textAlign:"right"}}>
        <div style={{lineHeight:"1em", fontWeight:"bold"}}>{result || <br/>}</div>
        <div style={{textStyle:"italic", fontSize:"0.8em"}}>{setting}</div>
      </div>
    );

    if (!enabledOnly) {
      elements.append(
        <c.Buttons>
          <c.Button title="Show" onClick={setComponent({ visible: true })}/>
          <c.Button title="Hide" onClick={setComponent({ visible: false })}/>
        </c.Buttons>,
        <c.Spacer inline/>
      );
    }

    if (!visibleOnly) {
      elements.append(
        <c.Buttons>
          <c.Button title="Enable" onClick={setComponent({ disabled: false })}/>
          <c.Button title="Disable" onClick={setComponent({ disabled: true })}/>
        </c.Buttons>,
        <c.Spacer inline/>
      );
    }

    return elements.render();
  }
}

export default Enablers;

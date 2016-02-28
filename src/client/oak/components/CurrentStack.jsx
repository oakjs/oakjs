import React, { PropTypes } from "react";
import Stub from "./Stub";

export default class CurrentStack extends React.Component {
  static contextTypes = {
    app: PropTypes.any,
  }

  componentDidMount() {
    app.stack.component = this.refs.stack;
  }

  componentWillUpdate() {
    delete app.stack.omponent;
  }

  componentDidUpdate() {
    app.stack.component = this.refs.stack;
  }

  componentWillUnmount() {
    delete app.stack.omponent;
  }

  render() {
    const stack = this.context.app.stack;
    if (!stack) return <Stub/>;
    return React.createElement(stack.ComponentConstructor, { ref: "stack" });
  }
}

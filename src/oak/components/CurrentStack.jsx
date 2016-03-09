import React, { PropTypes } from "react";
import Stub from "./Stub";

export default class CurrentStack extends React.Component {
  static contextTypes = {
    app: PropTypes.any,
  }

  componentDidMount() {
    app._stackComponent = this.refs.stack;
  }

  componentDidUpdate() {
    app._stackComponent = this.refs.stack;
  }

  componentWillUpdate() {
    delete app._stackComponent;
  }

  componentWillUnmount() {
    delete app._stackComponent;
  }

  render() {
    const stack = this.context.app.stack;
    if (!stack) return false;
    return React.createElement(stack.Component, { ref: "stack" });
  }
}

import React, { PropTypes } from "react";
import Stub from "./Stub";

export default class CurrentStack extends React.Component {
  static contextTypes = {
    app: PropTypes.any,
  }

  componentDidMount() {
    app.stackComponent = this.refs.stack;
  }

  componentDidUpdate() {
    app.stackComponent = this.refs.stack;
  }

  componentWillUpdate() {
    delete app.stackComponent;
  }

  componentWillUnmount() {
    delete app.stackComponent;
  }

  render() {
    const stack = this.context.app.stack;
    if (!stack) return false;
    return React.createElement(stack.Component, { ref: "stack" });
  }
}

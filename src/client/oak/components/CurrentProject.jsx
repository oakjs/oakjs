import React, { PropTypes } from "react";
import Stub from "./Stub";

export default class CurrentProject extends React.Component {
  static contextTypes = {
    app: PropTypes.any,
  }

  componentDidMount() {
    app.project.component = this.refs.project;
  }

  componentWillUpdate() {
    delete app.project.omponent;
  }

  componentDidUpdate() {
    app.project.component = this.refs.project;
  }

  componentWillUnmount() {
    delete app.project.omponent;
  }

  render() {
    const project = this.context.app.project;
    if (!project) return <Stub/>;
    return React.createElement(project.Component, { ref: "project" });
  }
}

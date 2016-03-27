import React, { PropTypes } from "react";

export default class CurrentProject extends React.Component {
  static contextTypes = {
    app: PropTypes.any,
  }

  componentDidMount() {
    app.runner._projectComponent = this.refs.project;
  }

  componentDidUpdate() {
    app.runner._projectComponent = this.refs.project;
  }

  componentWillUpdate() {
    delete app.runner._projectComponent;
  }

  componentWillUnmount() {
    delete app.runner._projectComponent;
  }

  render() {
    const project = this.context.app.runner.project;
    if (!project) return false;
    return React.createElement(project.Component, { ref: "project" });
  }
}

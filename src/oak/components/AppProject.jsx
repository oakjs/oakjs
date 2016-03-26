import React, { PropTypes } from "react";

export default class AppProject extends React.Component {
  static contextTypes = {
    app: PropTypes.any,
  }

  componentDidMount() {
    app.projectComponent = this.refs.project;
  }

  componentDidUpdate() {
    app.projectComponent = this.refs.project;
  }

  componentWillUpdate() {
    delete app.projectComponent;
  }

  componentWillUnmount() {
    delete app.projectComponent;
  }

  render() {
    const project = this.context.app.project;
    if (!project) return false;
    return React.createElement(project.Component, { ref: "project" });
  }
}

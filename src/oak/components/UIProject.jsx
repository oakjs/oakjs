import React, { PropTypes } from "react";

export default class AppProject extends React.Component {
  static contextTypes = {
    app: PropTypes.any,
  }

  componentDidMount() {
    app.ui.projectComponent = this.refs.project;
  }

  componentDidUpdate() {
    app.ui.projectComponent = this.refs.project;
  }

  componentWillUpdate() {
    delete app.ui.projectComponent;
  }

  componentWillUnmount() {
    delete app.ui.projectComponent;
  }

  render() {
    const project = this.context.app.ui.project;
    if (!project) return false;
    return React.createElement(project.Component, { ref: "project" });
  }
}

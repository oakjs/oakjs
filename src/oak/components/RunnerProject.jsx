import React, { PropTypes } from "react";

export default class CurrentProject extends React.Component {
  static contextTypes = {
    oak: PropTypes.any,
  }

  componentDidMount() {
    oak.runner._projectComponent = this.refs.project;
  }

  componentDidUpdate() {
    oak.runner._projectComponent = this.refs.project;
  }

  componentWillUpdate() {
    delete oak.runner._projectComponent;
  }

  componentWillUnmount() {
    delete oak.runner._projectComponent;
  }

  render() {
    const project = this.context.oak.runner.project;
    if (!project) return false;
    return React.createElement(project.Component, { ref: "project" });
  }
}

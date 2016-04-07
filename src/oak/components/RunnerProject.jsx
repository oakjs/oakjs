import React, { PropTypes } from "react";

import "./RunnerProject.css";

export default class CurrentProject extends React.Component {
  static contextTypes = {
    oak: PropTypes.any,
  }

  static childContextTypes = {
    _controller: PropTypes.any,
  }

  getChildContext() {
    return {
      _controller: oak.runner.project
    }
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
    return React.createElement(project.Component, { ref: "project", className:"runner" });
  }
}

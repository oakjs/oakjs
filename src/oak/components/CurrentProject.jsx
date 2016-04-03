//////////////////////////////
//  CurrentProject component
//  - Renders the current `oak.project` ComponentController
//  - sets `oak._projectComponent` to the rendered component.
//////////////////////////////

import React, { PropTypes } from "react";

export default class CurrentProject extends React.Component {
  static contextTypes = {
    oak: PropTypes.any,
  }

  componentDidMount() {
    oak._projectComponent = this.refs.project;
  }

  componentDidUpdate() {
    oak._projectComponent = this.refs.project;
  }

  componentWillUpdate() {
    delete oak._projectComponent;
  }

  componentWillUnmount() {
    delete oak._projectComponent;
  }

  render() {
    const project = this.context.oak.project;
    if (!project) return false;
    return React.createElement(project.Component, { ref: "project", className:"current" });
  }
}

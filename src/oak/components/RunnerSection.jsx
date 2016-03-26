import React, { PropTypes } from "react";
import Stub from "./Stub";

export default class RunnerSection extends React.Component {
  static contextTypes = {
    app: PropTypes.any,
  }

  componentDidMount() {
    app.runner.sectionComponent = this.refs.section;
  }

  componentDidUpdate() {
    app.runner.sectionComponent = this.refs.section;
  }

  componentWillUpdate() {
    delete app.runner.sectionComponent;
  }

  componentWillUnmount() {
    delete app.runner.sectionComponent;
  }

  render() {
    const section = this.context.app.runner.section;
    if (!section) return false;
    return React.createElement(section.Component, { ref: "section" });
  }
}

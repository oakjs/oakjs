import React, { PropTypes } from "react";
import Stub from "./Stub";

export default class RunnerSection extends React.Component {
  static contextTypes = {
    app: PropTypes.any,
  }

  componentDidMount() {
    app.runner._sectionComponent = this.refs.section;
  }

  componentDidUpdate() {
    app.runner._sectionComponent = this.refs.section;
  }

  componentWillUpdate() {
    delete app.runner._sectionComponent;
  }

  componentWillUnmount() {
    delete app.runner._sectionComponent;
  }

  render() {
    const section = this.context.app.runner.section;
    if (!section) return false;
    return React.createElement(section.Component, { ref: "section" });
  }
}

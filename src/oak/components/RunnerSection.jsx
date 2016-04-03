import React, { PropTypes } from "react";
import Stub from "./Stub";

export default class RunnerSection extends React.Component {
  static contextTypes = {
    oak: PropTypes.any,
  }

  componentDidMount() {
    oak.runner._sectionComponent = this.refs.section;
  }

  componentDidUpdate() {
    oak.runner._sectionComponent = this.refs.section;
  }

  componentWillUpdate() {
    delete oak.runner._sectionComponent;
  }

  componentWillUnmount() {
    delete oak.runner._sectionComponent;
  }

  render() {
    const section = this.context.oak.runner.section;
    if (!section) return false;
    return React.createElement(section.Component, { ref: "section", className:"runner" });
  }
}

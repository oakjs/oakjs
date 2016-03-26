import React, { PropTypes } from "react";
import Stub from "./Stub";

export default class RunnerSection extends React.Component {
  static contextTypes = {
    app: PropTypes.any,
  }

  componentDidMount() {
    app.ui.sectionComponent = this.refs.section;
  }

  componentDidUpdate() {
    app.ui.sectionComponent = this.refs.section;
  }

  componentWillUpdate() {
    delete app.ui.sectionComponent;
  }

  componentWillUnmount() {
    delete app.ui.sectionComponent;
  }

  render() {
    const section = this.context.app.ui.section;
    if (!section) return false;
    return React.createElement(section.Component, { ref: "section" });
  }
}

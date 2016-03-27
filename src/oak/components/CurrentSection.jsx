//////////////////////////////
//  CurrentSection component
//  - Renders the current `app.section` ComponentController
//  - sets `app._sectionComponent` to the rendered component.
//////////////////////////////

import React, { PropTypes } from "react";

export default class CurrentSection extends React.Component {
  static contextTypes = {
    app: PropTypes.any,
  }

  componentDidMount() {
    app._sectionComponent = this.refs.section;
  }

  componentDidUpdate() {
    app._sectionComponent = this.refs.section;
  }

  componentWillUpdate() {
    delete app._sectionComponent;
  }

  componentWillUnmount() {
    delete app._sectionComponent;
  }

  render() {
    const section = this.context.app.section;
    if (!section) return false;
    return React.createElement(section.Component, { ref: "section" });
  }
}

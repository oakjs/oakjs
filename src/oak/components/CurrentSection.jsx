//////////////////////////////
//  CurrentSection component
//  - Renders the current `oak.section` ComponentController
//  - sets `oak._sectionComponent` to the rendered component.
//////////////////////////////

import React, { PropTypes } from "react";

export default class CurrentSection extends React.Component {
  // Oak editor prefs
  static editor = { draggable: false, droppable: true };

  static contextTypes = {
    oak: PropTypes.any,
  }

  static childContextTypes = {
    _controller: PropTypes.any,
  }

  getChildContext() {
    return {
      _controller: oak.section
    }
  }


  componentDidMount() {
    oak._sectionComponent = this.refs.section;
  }

  componentDidUpdate() {
    oak._sectionComponent = this.refs.section;
  }

  componentWillUpdate() {
    delete oak._sectionComponent;
  }

  componentWillUnmount() {
    delete oak._sectionComponent;
  }

  render() {
    const section = this.context.oak.section;
    if (!section) return false;
    return React.createElement(section.Component, { ref: "section", className:"current" });
  }
}

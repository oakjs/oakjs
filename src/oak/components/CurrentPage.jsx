//////////////////////////////
//  CurrentPage component
//  - Renders the current `oak.page` ComponentController
//  - sets `oak._pageComponent` to the rendered component.
//////////////////////////////

import React, { PropTypes } from "react";

export default class CurrentPage extends React.Component {
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
      _controller: oak.page
    }
  }

  componentDidMount() {
    oak._pageComponent = this.refs.page;
  }

  componentDidUpdate() {
    oak._pageComponent = this.refs.page;
  }

  componentWillUpdate() {
    delete oak._pageComponent;
  }

  componentWillUnmount() {
    delete oak._pageComponent;
  }

  render() {
    const page = this.context.oak.page;
    if (!page) return false;
    return React.createElement(page.Component, { ref: "page", className:"current" });
  }
}


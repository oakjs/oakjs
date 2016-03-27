//////////////////////////////
//  CurrentPage component
//  - Renders the current `app.page` ComponentController
//  - sets `app._pageComponent` to the rendered component.
//////////////////////////////

import React, { PropTypes } from "react";

export default class CurrentPage extends React.Component {
  static contextTypes = {
    app: PropTypes.any,
  }

  componentDidMount() {
    app._pageComponent = this.refs.page;
  }

  componentDidUpdate() {
    app._pageComponent = this.refs.page;
  }

  componentWillUpdate() {
    delete app._pageComponent;
  }

  componentWillUnmount() {
    delete app._pageComponent;
  }

  render() {
    const page = this.context.app.page;
    if (!page) return false;
    return React.createElement(page.Component, { ref: "page" });
  }
}


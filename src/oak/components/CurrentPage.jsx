import React, { PropTypes } from "react";
import Stub from "./Stub";

export default class CurrentPage extends React.Component {
  static contextTypes = {
    app: PropTypes.any,
  }

  componentDidMount() {
    app.pageComponent = this.refs.page;
  }

  componentDidUpdate() {
    app.pageComponent = this.refs.page;
  }

  componentWillUpdate() {
    delete app.pageComponent;
  }

  componentWillUnmount() {
    delete app.pageComponent;
  }

  render() {
    const page = this.context.app.page;
    if (!page) return false;
    return React.createElement(page.Component, { ref: "page" });
  }
}


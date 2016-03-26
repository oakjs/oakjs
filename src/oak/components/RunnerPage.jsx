import React, { PropTypes } from "react";

export default class RunnerPage extends React.Component {
  static contextTypes = {
    app: PropTypes.any,
  }

  componentDidMount() {
    app.ui.pageComponent = this.refs.page;
  }

  componentDidUpdate() {
    app.ui.pageComponent = this.refs.page;
  }

  componentWillUpdate() {
    delete app.ui.pageComponent;
  }

  componentWillUnmount() {
    delete app.ui.pageComponent;
  }

  render() {
    const page = this.context.app.ui.page;
    if (!page) return false;
    return React.createElement(page.Component, { ref: "page" });
  }
}


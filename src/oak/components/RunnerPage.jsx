import React, { PropTypes } from "react";

export default class RunnerPage extends React.Component {
  static contextTypes = {
    app: PropTypes.any,
  }

  componentDidMount() {
    app.runner.pageComponent = this.refs.page;
  }

  componentDidUpdate() {
    app.runner.pageComponent = this.refs.page;
  }

  componentWillUpdate() {
    delete app.runner.pageComponent;
  }

  componentWillUnmount() {
    delete app.runner.pageComponent;
  }

  render() {
    const page = this.context.app.runner.page;
    if (!page) return false;
    return React.createElement(page.Component, { ref: "page" });
  }
}


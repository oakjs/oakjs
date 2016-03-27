import React, { PropTypes } from "react";

export default class RunnerPage extends React.Component {
  static contextTypes = {
    app: PropTypes.any,
  }

  componentDidMount() {
    app.runner._pageComponent = this.refs.page;
  }

  componentDidUpdate() {
    app.runner._pageComponent = this.refs.page;
  }

  componentWillUpdate() {
    delete app.runner._pageComponent;
  }

  componentWillUnmount() {
    delete app.runner._pageComponent;
  }

  render() {
    const page = this.context.app.runner.page;
    if (!page) return false;
    return React.createElement(page.Component, { ref: "page" });
  }
}


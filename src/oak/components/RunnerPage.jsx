import React, { PropTypes } from "react";

export default class RunnerPage extends React.Component {
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
      _controller: oak.runner.page
    }
  }

  componentDidMount() {
    oak.runner._pageComponent = this.refs.page;
  }

  componentDidUpdate() {
    oak.runner._pageComponent = this.refs.page;
  }

  componentWillUpdate() {
    delete oak.runner._pageComponent;
  }

  componentWillUnmount() {
    delete oak.runner._pageComponent;
  }

  render() {
    const page = this.context.oak.runner.page;
    if (!page) return false;
    return React.createElement(page.Component, { ref: "page", className:"runner" });
  }
}


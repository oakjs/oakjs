//////////////////////////////
//  ComponentProxy component
//  - Renders the current/runner XXX ComponentController
//////////////////////////////

import React, { PropTypes } from "react";

class ComponentProxy extends React.Component {
  // You must implement the following methods:
  getController() { throw new TypeError("Your subclass must implement `getController()`") }
  setGlobalComponent() { throw new TypeError("Your subclass must implement `setGlobalComponent()`") }
  clearGlobalComponent() { throw new TypeError("Your subclass must implement `clearGlobalComponent()`") }
  render() { throw new TypeError("Your subclass must implement `render()`") }

  // TODO: rename `_controller`
  // TODO: this isn't actually used anywhere... ????
  static childContextTypes = {
    _controller: PropTypes.any,
  }

  getChildContext() {
    return {
      _controller: this.getController()
    }
  }

  componentDidMount() {
    this.setGlobalComponent()
  }

  componentDidUpdate() {
    this.setGlobalComponent()
  }

  componentWillUpdate() {
    this.clearGlobalComponent()
  }

  componentWillUnmount() {
    this.clearGlobalComponent()
  }
}



//////////////////////////////
//  Runner Project / Section / Page
//////////////////////////////

export class RunnerProject extends ComponentProxy {
  getController() { return oak.runner.project; }
  setGlobalComponent() { oak.runner._projectComponent = this.refs.project; }
  clearGlobalComponent() { delete oak.runner._projectComponent; }
  render() {
    const project = oak.runner.project;
    if (!project) return false;
    return React.createElement(project.Component, { ref: "project" });
  }
}

export class RunnerSection extends ComponentProxy {
  getController() { return oak.runner.section; }
  setGlobalComponent() { oak.runner._sectionComponent = this.refs.section; }
  clearGlobalComponent() { delete oak.runner._sectionComponent; }
  render() {
    const section = oak.runner.section;
    if (!section) return false;
    return React.createElement(section.Component, { ref: "section" });
  }
}

export class RunnerPage extends ComponentProxy {
  getController() { return oak.runner.page; }
  setGlobalComponent() { oak.runner._pageComponent = this.refs.page; }
  clearGlobalComponent() { delete oak.runner._pageComponent; }
  render() {
    const page = oak.runner.page;
    if (!page) return false;
    return React.createElement(page.Component, { ref: "page" });
  }
}



//////////////////////////////
//  Current Project / Section / Page
//////////////////////////////

export class CurrentProject extends ComponentProxy {
  getController() { return oak.project; }
  setGlobalComponent() { oak._projectComponent = this.refs.project; }
  clearGlobalComponent() { delete oak._projectComponent; }
  render() {
    const project = oak.project;
    if (!project) return false;
    return React.createElement(project.Component, { ref: "project" });
  }
}

export class CurrentSection extends ComponentProxy {
  getController() { return oak.section; }
  setGlobalComponent() { oak._sectionComponent = this.refs.section; }
  clearGlobalComponent() { delete oak._sectionComponent; }
  render() {
    const section = oak.section;
    if (!section) return false;
    return React.createElement(section.Component, { ref: "section" });
  }
}

export class CurrentPage extends ComponentProxy {
  getController() { return oak.page; }
  setGlobalComponent() { oak._pageComponent = this.refs.page; }
  clearGlobalComponent() { delete oak._pageComponent; }
  render() {
    const page = oak.page;
    if (!page) return false;
    return React.createElement(page.Component, { ref: "page" });
  }
}




// Export all in a lump
const allProxies = Object.assign({}, exports);
export default allProxies;

// Oak editor prefs for all
import { editify } from "../EditorProps";
Object.keys(allProxies).forEach( key =>
  editify({ draggable: true, droppable: false }, allProxies[key])
);





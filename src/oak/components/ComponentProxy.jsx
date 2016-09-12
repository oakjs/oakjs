//////////////////////////////
//  ComponentProxy component
//  - Renders the current/runner XXX ComponentController
//////////////////////////////

import React, { PropTypes } from "react";

import Page from "./Page";
import Placeholder from "./Placeholder";
import Project from "./Project";
import Section from "./Section";

export class ComponentProxy extends React.Component {
  // You must implement the following methods:
  getController() {
    return this.props.component;
  }

  // TODO: rename `_controller`
  // TODO: this isn't actually used anywhere... ????
  static childContextTypes = {
    controller: PropTypes.any,
  }

  getChildContext() {
    return {
      controller: this.getController()
    }
  }

  componentDidMount() {
    const controller = this.getController();
    if (controller) controller.component = this.refs.component;
  }

  componentDidUpdate() {
    const controller = this.getController();
    if (controller) controller.component = this.refs.component;
  }

  componentWillUpdate() {
    const controller = this.getController();
    if (controller) delete controller.component;
  }

  componentWillUnmount() {
    const controller = this.getController();
    if (controller) delete controller.component;
  }

  render() {
    const controller = this.getController();
    if (!controller) return null;
    return React.createElement(controller.Component, { ref: "component" });
  }
}



//////////////////////////////
//  Runner Project / Section / Page
//////////////////////////////

export class RunnerProject extends ComponentProxy {
  getController() { return oak.runner.project; }
}

export class RunnerSection extends ComponentProxy {
  getController() { return oak.runner.section; }
}

export class RunnerPage extends ComponentProxy {
  getController() { return oak.runner.page; }
}



//////////////////////////////
//  Current Project / Section / Page
//////////////////////////////

export class CurrentProject extends ComponentProxy {
  static contextTypes = {
    page: PropTypes.any
  }

  static childContextTypes = {
    controller: PropTypes.any,
    project: PropTypes.any,
    components: PropTypes.any
  }

  getChildContext() {
    const project = this.getController();
    return {
      controller: project,
      project,
      components: project && project.components
    }
  }

  // Drive the controller off of `props.page` or `context.page`.
  getController() {
    const page = this.props.page || this.context.page;
    return page && page.project;
  }

  render() {
    const controller = this.getController();
    if (!controller) return null;

    // If the current project is also the runner project,
    //  return a stub so we don't recurse.
    if (controller === oak.runner.project) {
      return (
        <Project>
          <CurrentSection/>
        </Project>
      );
    }
    else {
      return super.render()
    }
  }
}

export class CurrentSection extends ComponentProxy {
  static contextTypes = {
    page: PropTypes.any
  }

  static childContextTypes = {
    controller: PropTypes.any,
    section: PropTypes.any,
    components: PropTypes.any
  }

  getChildContext() {
    const section = this.getController();
    return {
      controller: section,
      section,
      components: section && section.components
    }
  }

  // Drive the controller off of `props.page` or `context.page`.
  getController() {
    const page = this.props.page || this.context.page;
    return page && page.section;
  }

  render() {
    const controller = this.getController();
    if (!controller) return null;

    // If the current section is also the runner section,
    //  return a stub so we don't recurse.
    if (controller === oak.runner.section) {
      return (
        <Section>
          <CurrentPage/>
        </Section>
      );
    }
    else {
      return super.render()
    }
  }
}

export class CurrentPage extends ComponentProxy {
  static contextTypes = {
    page: PropTypes.any
  }

  static childContextTypes = {
    controller: PropTypes.any,
    page: PropTypes.any,
    components: PropTypes.any
  }

  getChildContext() {
    const page = this.getController();
    return {
      controller: page,
      page,
      components: page && page.components
    }
  }

  // Drive the controller off of `props.page` or `context.page`.
  getController() {
    return this.props.page || this.context.page;
  }

  render() {
    const controller = this.getController();
    if (!controller) return null;

    // if the current page is also the runner page,
    //  return a <Placeholder> so we don't recurse
    if (controller === oak.runner.page) {
      return <Placeholder label="Current Page"/>
    }
    else {
      return super.render()
    }
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





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
  static contextTypes = {
    oak: PropTypes.any,
  }

  static childContextTypes = {
    controller: PropTypes.any,
    components: PropTypes.any
  }

  getChildContext() {
    const controller = this.getController();
    return {
      controller,
      components: controller && controller.components
    }
  }

  // If you have a fixed concept of who your controller is, override this.
//TODO: getter
  getController() {
    return this.props.component;
  }

  //
  // When we mount / unmount / update,
  // update our `controller.component` with the pointer to our live component.
  //
  componentDidMount() {
    const controller = this.getController();
    if (controller) {
      controller.component = this.refs.component;
//      if (controller === oak.runner.project) console.info("MOUNT: setting component of ", controller, " to ", this.refs.component);
    }
  }

// TODO: WillUpdate is firing AFTER DidUpdate which is messing things up!
//   componentWillUpdate() {
//     const controller = this.getController();
//     if (controller) {
//       delete controller.component;
//       if (controller === oak.runner.project) console.log("WILL UPDATE: clearing component of ", controller, " to ", this.refs.component);
//     }
//   }

  componentDidUpdate() {
    const controller = this.getController();
    if (controller) {
      controller.component = this.refs.component;
//      if (controller === oak.runner.project) console.info("DID UPDATE: setting component of ", controller, " to ", this.refs.component);
    }
  }

  componentWillUnmount() {
    const controller = this.getController();
    if (controller) {
      delete controller.component;
//      if (controller === oak.runner.project) console.log("WILL UNMOUNT: clearing component of ", controller, " to ", this.refs.component);
    }
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
  getController() { return this.context.oak.runner.project; }
}

export class RunnerSection extends ComponentProxy {
  getController() { return this.context.oak.runner.section; }
}

export class RunnerPage extends ComponentProxy {
  getController() { return this.context.oak.runner.page; }
}

export class RunnerModal extends ComponentProxy {
  getTopModal() { return this.context.oak.runner.modal }
  getController() { return this.getTopModal() && this.getTopModal().controller }
  render() {
    const controller = this.getController();
    if (!controller) return null;

    const modal = this.getTopModal();
    const props = { ...modal.props, ref: "component" };
    return React.createElement(controller.Component, props);
  }
}



//////////////////////////////
//  Current Project / Section / Page
//////////////////////////////

export class CurrentProject extends ComponentProxy {
  static contextTypes = {
    ...ComponentProxy.contextTypes,
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
    if (controller === this.context.oak.runner.project) {
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
    ...ComponentProxy.contextTypes,
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
    if (controller === this.context.oak.runner.section) {
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
    ...ComponentProxy.contextTypes,
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
    if (controller === this.context.oak.runner.page) {
      return <Placeholder label="Current Page"/>
    }
    else {
      return super.render()
    }
  }
}

// Export all in a lump
const components = {...exports};
export default components;

// Set up DragProps for everything.
import DragProps from "oak-roots/DragProps";
DragProps.register("Oak", { draggable: true, droppable: false }, components);

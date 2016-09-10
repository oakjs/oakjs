//////////////////////////////
//  ComponentProxy component
//  - Renders the current/runner XXX ComponentController
//////////////////////////////

import React, { PropTypes } from "react";

class ComponentProxy extends React.Component {
  // You must implement the following methods:
  getController() { throw new TypeError("Your subclass must implement `getController()`") }
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
  getController() { return oak.project; }
}

export class CurrentSection extends ComponentProxy {
  getController() { return oak.section; }
}

export class CurrentPage extends ComponentProxy {
  getController() { return oak.page; }
}




// Export all in a lump
const allProxies = Object.assign({}, exports);
export default allProxies;

// Oak editor prefs for all
import { editify } from "../EditorProps";
Object.keys(allProxies).forEach( key =>
  editify({ draggable: true, droppable: false }, allProxies[key])
);





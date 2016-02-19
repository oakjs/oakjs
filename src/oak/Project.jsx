import React, { PropTypes } from "react";
import { Route, IndexRoute } from "react-router";
import classNames from "classnames";

import * as oakComponents from "oak/components";

// Project-specific CSS styling.
import "./Project.css";

export default class OakProject extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
  }

  static childContextTypes = {
    project: PropTypes.any,
    components: PropTypes.any
  };

  getChildContext() {
    return { project: this, components: this.components };
  }


  componentDidUpdate() {
    console.info("re-initializing project");
    this.constructor.initialize();
  }

  // Initialize a Project constructor, it's stacks and it's cards.
  // NOTE: In theory, you can call this if, eg, the stacks or cards change and things will adjust...
  static initialize({ stackMap, themeComponents, projectComponents }={}) {
    const project = this;

    // remember/initialize anything passed in
    if (themeComponents) project.themeComponents = themeComponents;
    if (projectComponents) project.projectComponents = projectComponents;
    if (stackMap) project.stackMap = stackMap;

    // merge oak, theme and project components into one map
    project.components = Object.assign({}, project.themeComponents, oakComponents, project.projectComponents);

    // Initialize stacks, which will initialize their cards.
    project.stacks.forEach((stack, stackIndex) => stack.initialize({ project, stackIndex }));

//console.info("project after initializing:", project);
    return project;
  }

  //////////////////////////////
  // Syntactic sugar for deriving stuff
  //////////////////////////////
  static get stackIds() { return Object.keys(this.stackMap) }
  static get stacks() { return this.stackIds.map(stackId => this.stackMap[stackId]) }
  static get id() { return this.defaultProps.id }
  static get title() { return this.defaultProps.title }
  static get path() { return "/projects/" + this.id }
  // Router for project and its current set of stacks.
  // NOTE: depends on `Project.initialize()` being called.
  static get route() {
    const stacks = this.stacks;
    const stackRoutes = [/*<IndexRoute component={stacks[0]}/>,*/ ...stacks.map(stack => stack.route)];
    const routeProps = { path: "projects/" + this.id, component: this};
    return React.createElement(Route, routeProps, ...stackRoutes);
  }

  //////////////////////////////
  // Syntactic sugar for treating static things like instance things.
  //////////////////////////////

  // Return the stack / component CONSTRUCTORS (NOT instances).
  // (Really only useful for calling static methods).
  get components() { return this.constructor.components }
  get stacks() { return this.constructor.stacks }

  // Reflection
  get id() { return this.constructor.id }
  get title() { return this.constructor.title }
  get path() { return this.constructor.path }



  //////////////////////////////
  // Rendering
  //////////////////////////////

  get renderProps() {
    const { id, className, style } = this.props;
    return {
      id,
      className: classNames("oak Project", className),
      style
    }
  }

  render() {
    return <div {...this.renderProps}>{this.props.children}</div>;
  }
}

//////////////////////////////
//  Page Thumbnail viewer for a project (or section?)
//
//  Section is shown as grouping header (if there are more than one)
//
//  Pages are shown WITHOUT their enclosing project/section rendering.
//
//////////////////////////////

import React, { PropTypes } from "react";
import { classNames } from "oak-roots/util/react";

import OakComponent from "./OakComponent";
import RenderWhenVisible from "./RenderWhenVisible";

import "./ComponentThumbs.less";


// Show thumb for one particular page (specified as `component` :-( ).
export class PageThumb extends RenderWhenVisible(OakComponent) {
  static childContextTypes = {
    controller: PropTypes.any,
    project: PropTypes.any,
    section: PropTypes.any,
    page: PropTypes.any,
    components: PropTypes.any
  }

  getChildContext() {
    const page = this.props.component;
    return {
      controller: page,
      project: page && page.project,
      section: page && page.section,
      components: page && page.components
    }
  }

  static propTypes = {
    component: PropTypes.any,           // String path or page pointer
    showTitle: PropTypes.bool,          // If true, we'll show the title of the component above the children.
    className: PropTypes.string,        // Class name for the wrapper.
  }

  static defaultProps = {
    showTitle: true,
    className: ""
  }

  get component() {
    const component = oak.get(this.props.component);
    if (!component) console.warn(`${this}: can't find`, this.props.component);
    return component;
  }

  renderPlaceholder() {
    const { Oak, SUI } = this.context.components;

    const component = this.component;
    if (!component) return null;

    return this.renderWrapper(component, <Oak.Placeholder/>);
//    return this.renderWrapper(component, <Oak.Placeholder className="small" label={component.title}/>);
  }

  renderContents() {
    const { Oak, SUI } = this.context.components;

    const component = this.component;
    if (!component) return null;

    if (!component.isLoaded && !component.isLoading) {
      component.load().then( this.updateSoon );
    }
    if (component.isLoaded) {
      return this.renderWrapper(component, <component.Component/>);
    }
    return this.renderPlaceholder();
  }

  renderWrapper(component, children) {
    const { Oak, SUI } = this.context.components;
//console.warn("showing thumbs for ", component);
    let { className, showTitle } = this.props;

    className = classNames(
      "oak",
      className,
//      this.state.onScreen ? "green inverted" : "red inverted",
      !component.isLoaded && "loading",
      "PageThumb"
    );

    let title;
    if (showTitle && component.title) {
      title = (
        <SUI.Label appearance="fluid top attached">
          {`${component.type}: ${component.title}`}
        </SUI.Label>
      );
    }

    return (
      <SUI.Segment className={className}>
        {title}
        <div className="body">
          {children}
        </div>
        <div className="mask" onClick={ () => oak.actions.showPage({ page: component }) } />
      </SUI.Segment>
    )
  }

  toString() {
    return `<PageThumb ${this.component ? this.component.title : "unknown"}/>`;
  }
}

// Show thumbs for children of `component`.
export class ChildThumbs extends OakComponent {
  static propTypes = {
    component: PropTypes.any,           // String or component pointer
    showTitle: PropTypes.bool,          // If true, we'll show the title of the component above the children.
    className: PropTypes.string,        // Class name for the wrapper.
    ChildThumbComponent: PropTypes.any, // Component to use to draw children.
  }

  renderChildren(component) {
    const children = component.children;
    if (!children || children.length === 0) return null;

    const { ChildThumbComponent } = this.props;
    return children.map( child => <ChildThumbComponent key={child.path} component={child}/> );
  }

  renderTitle(component) {
    if (!component.title) return undefined;
    return <h2>{component.title}</h2>
  }


  renderWrapper(compnent, className, title, children) {
    return (
      <div className={className}>
        { title }
        { children }
      </div>
    );
  }

  render() {
    if (this.hidden) return null;
    if (!this.props.component) {
      console.warn(`${this}: component not specified`);
      return null;
    }

    const { oak, components } = this.context;
    const { Oak, SUI } = components;

    let { className, showTitle } = this.props;

    // Find the component controller and bail if not found.
    let component = oak.get(this.props.component);
    if (!component) {
      console.warn(`${this}: can't find`, this.props.component);
// TODO: return placeholder?
      return null;
    }

    // figure out children to render
    let children;
    if (component.isLoaded) {
      children = this.renderChildren(component);
    }
    else {
      // load and update us when the load finishes
      component.load().then( this.updateSoon );
      // and output a loader
      children = <SUI.Loader/>;
    }

    // Render the wrapper along with the children.
    // NOTE: this is split out so subclasses can draw the wrappers differently.
    className = `oak ${className}`;
    const title = (showTitle && this.renderTitle(component)) || undefined;
    return this.renderWrapper(component, className, title, children)
  }
}

// Show thumbs for all children of section (specified as `component` :-( ).
export class SectionThumb extends ChildThumbs {
  static childContextTypes = {
    controller: PropTypes.any,
    project: PropTypes.any,
    section: PropTypes.any,
    components: PropTypes.any
  }

  getChildContext() {
    const section = this.props.component;
    return {
      controller: section,
      project: section && section.project,
      section: section,
      components: section && section.components
    }
  }

  static defaultProps = {
    className: "SectionThumb",
    ChildThumbComponent: PageThumb,
    showTitle: true,
  }

  renderTitle(component) {
    if (!component.title) return;
    return <h3>{`${component.type}: ${component.title}`}</h3>;
  }
}


// Show thumbs for all children of project (specified as `component` :-( ).
export class ProjectThumb extends ChildThumbs {
  static childContextTypes = {
    controller: PropTypes.any,
    project: PropTypes.any,
    components: PropTypes.any
  }

  getChildContext() {
    const project = this.props.component;
    return {
      controller: project,
      project,
      components: project && project.components
    }
  }

  static defaultProps = {
    className: "ProjectThumb",
    ChildThumbComponent: SectionThumb,
    showTitle: true,
  }

  renderTitle(component) {
    if (!component.title) return;
    return <h2>{`${component.type}: ${component.title}`}</h2>;
  }

  renderWrapper(component, className, title, children) {
    const { Oak, SUI } = this.context.components;
    return (
      <SUI.Container className={className}>
        { title }
        { children }
      </SUI.Container>
    );
  }
}


// Export all in a lump
const all = {...exports};
export default all;

// Set up Oak editorProps for all
import { editifyMap } from "../EditorProps";
editifyMap("Oak", { draggable: true, droppable: false }, all);

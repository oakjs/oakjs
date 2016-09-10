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

import "./ComponentThumbs.less";


// Show thumb for one particular page (specified as `component` :-( ).
export class PageThumb extends OakComponent {
  static propTypes = {
    component: PropTypes.any,           // String path or page pointer
    showTitle: PropTypes.bool,          // If true, we'll show the title of the component above the children.
    className: PropTypes.string,        // Class name for the wrapper.
  }

  static defaultProps = {
    showTitle: true,
    className: ""
  }

  renderTitle(component) {
    if (!component.title) return undefined;

    const { SUI } = this.context.components;
    return (
      <SUI.Label appearance="fluid top attached">
        {`${component.type}: ${component.title}`}
      </SUI.Label>
    );
  }


  render() {
    if (this.hidden || !this.props.component) return null;

    const { oak, components } = this.context;
    const { Oak, SUI } = components;

    const component = oak.get(this.props.component);
    if (!component) {
      console.warn(`${this}: can't find`, this.props.component);
      return null;
    }

    if (!component.isLoaded && !component.isLoading) {
      component.load().then( this.updateSoon );
    }

//console.warn("showing thumbs for ", component);
    let { className, showTitle } = this.props;
    className = classNames("oak", className, component.isLoading && "loading", "PageThumb");
    return (
      <SUI.Segment className={className}>
        { showTitle && this.renderTitle(component) }
        <div className="body">
          {component.isLoaded && <component.Component ref="component"/>}
        </div>
        <div className="mask" onClick={ () => oak.actions.showPage({ page: component }) } />
      </SUI.Segment>
    );
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

  renderTitle(component) {
    if (!component.title) return undefined;
    return <h2>{component.title}</h2>
  }

  render() {
    if (this.hidden) return null;
    if (!this.props.component) {
      console.warn(`${this}: component not specified`);
      return null;
    }

    const { oak, components } = this.context;
    const { Oak, SUI } = components;

    let { ChildThumbComponent, className, showTitle } = this.props;

    let component = oak.get(this.props.component);
    if (!component) {
      console.warn(`${this}: can't find`, this.props.component);
// TODO: return placeholder?
      return null;
    }

    if (!component.isLoaded) {
      component.load().then( this.updateSoon );
    }

    const children = component.isLoaded
      ? component.children.map( child => <ChildThumbComponent key={child.path} component={child}/> )
      : <SUI.Loader/>;

//componentconsole.warn("showing thumbs for ", component);
    return (
      <div className={`oak ${className}`}>
        { showTitle && this.renderTitle(component) }
        { children }
      </div>
    );
  }
}

// Show thumbs for all children of section (specified as `component` :-( ).
export class SectionThumb extends ChildThumbs {
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
  static defaultProps = {
    className: "ProjectThumb",
    ChildThumbComponent: SectionThumb,
    showTitle: true,
  }

  renderTitle(component) {
    if (!component.title) return;
    return <h2>{`${component.type}: ${component.title}`}</h2>;
  }
}

// Oak editor prefs
import { editify } from "../EditorProps";
editify({ draggable: true, droppable: false }, PageThumb);

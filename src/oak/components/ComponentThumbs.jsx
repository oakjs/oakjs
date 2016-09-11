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

//
//   render() {
//     if (this.hidden || !this.props.component) return null;
//
//     const { oak, components } = this.context;
//     const { Oak, SUI } = components;
//
//     const component = oak.get(this.props.component);
//     if (!component) {
//       console.warn(`${this}: can't find`, this.props.component);
//       return null;
//     }
//
//     // don't actually draw until we're visible on screen
//     let children;
//     if (this.state.onScreen) {
// //       if (!component.isLoaded && !component.isLoading) {
// //         component.load().then( this.updateSoon );
// //       }
// //       if (component.isLoaded) children = <component.Component ref="component"/>;
//     }
//     children = this.state.onScreen ? "shown" : "hidden";
//
// //console.warn("showing thumbs for ", component);
//     let { className, showTitle } = this.props;
//     className = classNames(
//       "oak",
//       className,
//       this.state.onScreen ? "green" : "red",
//       "inverted",
//       //!component.isLoaded && "loading",
//       "PageThumb"
//     );
//     return (
//       <SUI.Segment className={className}>
//         { showTitle && this.renderTitle(component) }
//         <div className="body">
//           {<component.Component ref="component"/>}
//         </div>
//       </SUI.Segment>
//     );
//   }
//}


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

    className = `oak ${className}`;
    const title = (showTitle && this.renderTitle(component)) || undefined;
    const children = component.isLoaded
      ? component.children.map( child => <ChildThumbComponent key={child.path} component={child}/> )
      : <SUI.Loader/>;

    return this.renderWrapper(component, className, title, children)
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

// Oak editor prefs
import { editify } from "../EditorProps";
editify({ draggable: true, droppable: false }, PageThumb);

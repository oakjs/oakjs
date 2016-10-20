//////////////////////////////
//
//  <Oak.Panel> component for use with oak e.g.:
//
//    <Oak.Panel>
//      <Oak.PanelHeader>...</Oak.PanelHeader>
//      <Oak.LeftSidebar>...</Oak.LeftSidebar>
//      <Oak.RightSidebar>...</Oak.RightSidebar>
//      <Oak.PanelFooter>...</Oak.PanelFooter>
//      ...main content elements...
//    </Oak.Panel>
//
//  Note that order is not important.
//
// TODO:
//  - rename to QuadPanel or something?
//  - sidebars inside vs. outside headers?
//  - non-`scrolling` sidebars should always scroll?  be sticky?
//  - different scrolling scenarios
//  - <Oak.Panel title> auto-create <Oak.PanelHeader><h2>{title}</h2></Oak.PanelHeader>
//  - <Oak.Panel closeable>   => set hidden dynamically?  how do we re-show it?  pref?
//  - <Oak.Toolbar> ?  <Oak.TopToolbar> vs <Oak.BottomToolbar> ?
//  - better name for "fluid`?  default to "fluid" and have "compact" ?
//  - padding?  applies to body only, with separate setting for header/sidebars/etc?
//      - "tight" | ("normal") | "relaxed" ?
//      - (none) | "padded" | "relaxed"
//      - appearance like SUI = "unpadded" "lightly padded" "padded" "very padded"
//
//////////////////////////////

import React, { Children, Component, PropTypes } from "react";

import fn from "oak-roots/util/fn";
import { classNames, unknownProps } from "oak-roots/util/react";

import AutoResized from "./AutoResized";
import OakComponent from "./OakComponent";

import "./Panel.less";


//
//  Panel class
//
export default class Panel extends AutoResized(OakComponent) {
  static propTypes = {
    ...OakComponent.propTypes,

    // take up full height?
    // TODO: rename???
    fluid: PropTypes.bool,

    // Scroll body?
    scrolling: PropTypes.bool,
  }

  // For scrolling panels, set the height of the `<.body>` to account for header/footer
  // when window is resized (and after draw/update).
// TODO: this mixes setting/reading DOM sizes in a way which is inherently inefficient... :-(
  onResize(rootElement) {
    if (this.hidden || !this.props.scrolling) return;


    const $panel = $(rootElement);
    const $body = $panel.children(".body");

    // reset the height of the body so we get an accurate measurement
    $body.height(1);

    // size body according to panel size - (header + footer)
    const panelHeight = $panel.innerHeight();
    const headerHeight = $panel.children(".oak.PanelHeader").outerHeight();
    const footerHeight = $panel.children(".oak.PanelFooter").outerHeight();
    const bodyHeight = panelHeight - headerHeight - footerHeight;

//console.info(`${this}: setting height to ${bodyHeight}`);
    $body.height(bodyHeight);
  }

  // if "scrolling" changes, clear explicitly body height
  // TESTME
  componentWillReceiveProps(nextProps) {
    if (this.props.scrolling && !nextProps.scrolling) {
      this.$getElement("body").height("");
    }
  }

  // Munge children into:
  //  <PanelHeader>
  //  <.body>
  //      <LeftSidebar>
  //      <.contents> ...loose content elements ... </.contents>
  //      <RightSidebar/>
  //  </.body>
  //  <PanelFooter>
  mungeChildren(props) {
    // Pull children out for possible reordering, unknown stuff goes in `contents`.
    let header, footer, left, right, contents = [];
    Children.forEach( props.children, (child) => {
      switch (child.type) {
        case PanelHeader:
          header = child; break;
        case PanelFooter:
          footer = child; break;
        case LeftSidebar:
          left = child; break;
        case RightSidebar:
          right = child;  break;
        default:
          contents.push(child);
      }
    });

    const children = [];
    // header
    if (header) children.push(header);
    // "body" row contains <LeftSidebar>...contents...<RightSidebar>
    const body = [];
    if (left) body.push(left);
    body.push(React.createElement("div", { className: "contents", ref: "contents" }, ...contents));
    if (right) body.push(right);
    children.push(React.createElement("div", { className: "body", ref: "body" }, ...body));
    // footer
    if (footer) children.push(footer);

    return children;
  }

  getRenderProps(props) {
    return {
      ...unknownProps(props, this.constructor, "id", "style"),
      className: classNames(
        "oak",
        { fluid: props.fluid, scrolling: props.scrolling },
        "Panel",
        props.className
      ),
      children: this.mungeChildren(props),
    }
  }

  render() {
    if (this.hidden) return;
    const props = this.getRenderProps(this.props);
    return React.createElement("div", props, ...props.children);
  }
}


// <PanelHeader> class inside a <Panel>
// TODO: <PanelHeader> ???
export class PanelHeader extends OakComponent {
  getRenderProps(props) {
    const heightStyle = "height" in props ? { height: props.height } : undefined;
    return {
      ...unknownProps(props, this.constructor, "id"),
      className: classNames( "oak PanelHeader", props.className ),
      style: {...props.style, ...heightStyle},
      children: props.children
    }
  }

  render() {
    if (this.hidden) return null;
    const props = this.getRenderProps(this.props);
    return React.createElement("header", props, ...props.children);
  }
}


// <PanelFooter> class inside a <Panel>
export class PanelFooter extends OakComponent {
  getRenderProps(props) {
    const heightStyle = "height" in props ? { height: props.height } : undefined;
    return {
      ...unknownProps(props, this.constructor, "id"),
      className: classNames( "oak PanelFooter", props.className ),
      style: {...props.style, ...heightStyle},
      children: props.children
    }
  }

  render() {
    if (this.hidden) return null;
    const props = this.getRenderProps(this.props);
    return React.createElement("footer", props, props.children);
  }
}


// <LeftSidebar> class inside a <Panel>
export class LeftSidebar extends OakComponent {
  static propTypes = {
    ...OakComponent.propTypes,
    width: PropTypes.number,
  }

  getRenderProps(props) {
    const widthStyle = "width" in props ? { width: props.width } : undefined;
    return {
      ...unknownProps(props, this.constructor, "id"),
      className: classNames( "oak LeftSidebar", props.className ),
      style: {...props.style, ...widthStyle},
      children: props.children
    }
  }

  render() {
    if (this.hidden) return null;
    const props = this.getRenderProps(this.props);
    return React.createElement("div", props, props.children);
  }
}


// <RightSidebar> class inside a <Panel>
export class RightSidebar extends OakComponent {
  getRenderProps(props) {
    const widthStyle = "width" in props ? { width: props.width } : undefined;
    return {
      ...unknownProps(props, this.constructor, "id"),
      className: classNames( "oak RightSidebar", props.className ),
      style: {...props.style, ...widthStyle},
      children: props.children
    }
  }

  render() {
    if (this.hidden) return null;
    const props = this.getRenderProps(this.props);
    return React.createElement("div", props, props.children);
  }
}

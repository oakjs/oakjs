"use strict";
//////////////////////////////
//
//  <Tabs> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import { autobind } from "core-decorators";

import { isElement, hasClass } from "./SUI";
import ElementBuffer from "./ElementBuffer";
import SUIModuleComponent from "./SUIModuleComponent";

import Tab from "./Tab";
import Tabbar from "./Tabbar";



function isATab(element) {
  return isElement(element, Tab) || hasClass(element, "tab");
}

function isATabbar(element) {
  return isElement(element, Tabbar)
      || (hasClass(element, "tabular") && hasClass(element, "menu"));
}

function getTabInfo(tab) {
  if (!tab) return undefined;

  if (isElement(tab, Tab)) {
    return {
      name: tab.props.name,
      title: tab.props.title,
      active: tab.props.active
    };
  }

  if (isElement(tab)) {
    return {
      name: tab.props["data-tab"],
      active: hasClass(tab, "active")
    }
  }
}


const moduleProps = {
  context: PropTypes.any,               // "Tabs are limited to those found inside this context"
  childrenOnly: PropTypes.bool,         // "If enabled limits tabs to children of passed context"
  maxDepth: PropTypes.number,           // "Maximum amount of nested tabs allowed (avoids recursion)"

  onVisible: PropTypes.func,            // Args: tabPath  "Called after a tab becomes visible"

  //
  // THE FOLLOWING ARE NOT SUPPORTED YET
  //
  // properties
  auto: PropTypes.any,                  // "Whether tab should load remote content as same url as history"
  history: PropTypes.any,               // "Whether to record history events for tab changes"
  ignoreFirstLoad: PropTypes.any,       // "Do not load content remotely on first tab load. Useful when open tab is rendered on server."
  evaluateScripts: PropTypes.any,       // "Whether inline scripts in tab HTML should be parsed on tab load."
  alwaysRefresh: PropTypes.any,         // "Tab should reload content every time it is opened"
  cache: PropTypes.any,                 // "Tab should cache content after loading locally to avoid server trip on second load"
  apiSettings: PropTypes.any,           // "Settings object for $.api call"
  historyType: PropTypes.any,           // "Can be set to hash or state."
  path: PropTypes.any,                  // "When using historyType state you must specify the base URL for all internal links."

  // SUI Callbacks
  onFirstLoad: PropTypes.func,          // Args: tabPath, [params], event     "Callback only the first time a tab is loaded"
  onLoad: PropTypes.func,               // Args: tabPath, [params], event     "Callback every time a tab is loaded"
  onRequest: PropTypes.func,            // Args: tabPath                      "Called after a tab becomes visible"
}



class SUITabs extends SUIModuleComponent {

  static defaultProps = {
    context: "parent",
    barOn: "top",
  }

  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,

    tabs: PropTypes.array,            // Array of elements, alternative to children
    children: PropTypes.any,

    bar: PropTypes.element,           // Alternative to embedded tabbar, we'll create one if not provided
    barOn: PropTypes.string,          // "top" or "bottom"
    barAppearance: PropTypes.string,  // appearance params for tabbar
    barExtras: PropTypes.any,         // extra stuff to go to the right of the tabbar

    active: PropTypes.any,            // 1-BASED index or name of tab to activate

    appearance: PropTypes.string,     //

    ...moduleProps
  };

  static childContextTypes = {
    tabs: PropTypes.any
  };

  getChildContext() {
    return { tabs: this };
  }

  //////////////////////////////
  // Component lifecycle
  //////////////////////////////

  componentDidMount() {
    super.componentDidMount();

    // activate the initial tab
    const { active } = this.props;
    if (active) this.showTab(active);
  }

  componentDidUpdate(prevProps) {
    super.componentDidUpdate(...arguments);

    const { active } = this.props;
    const { active: prevActive } = prevProps;

    if (active !== prevActive) this.showTab(active);
  }


  //////////////////////////////
  // SUI Tabs Module Properties
  //////////////////////////////

  static moduleProps = moduleProps;

  tellModule(...args) {
    return this.$ref().find(".tabular.menu .item").tab(...args);
  }

  setModuleProps(props) {
    // if context isn't set, use our `$ref
    if (!props.context) props.context = this.$ref();

    super.setModuleProps(props);
  }

  //////////////////////////////
  // SUI Tabs Module Behaviors
  //////////////////////////////

  changeTab(tabName) { return this.tellModule("change tab", tabName) }

  // NOTE: can't be `setState` cause React uses that...
  setTabState(path) { return this.tellModule("set path", path) }
  getPath() { return this.tellModule("get path") }
  isTab() { return this.tellModule("is tab") }

  cacheRead(path) { return this.tellModule("cache read", path) }
  cacheAdd(path, html) { return this.tellModule("cache add", path, html) }
  cacheRemove(path) { return this.tellModule("cache remove", path) }


  //////////////////////////////
  // Our additions to SUI Module Behaviors
  //////////////////////////////

  // Return the `name` for a tab given a 1-BASED index or tab name.
  getTabName(identifier) {
    // if we got a number, return the `data-tab` attribute of that tab
    if (typeof identifier === "number") {
      const tabs = this.$ref().children(".tab");
      const tab = tabs[identifier-1];
      if (tab) return $(tab).attr("data-tab");
      return undefined;
    }
    return identifier;
  }

  // Show a tab by 1-based numeric index or `name`.
  showTab(identifier) {
    const name = this.getTabName(identifier);
    if (name) this.changeTab(name);
  }






  //////////////////////////////
  // Rendering
  //////////////////////////////


  render() {
    const {
      id, className, style,
      // appearance
      appearance,
    } = this.props;

    const elements = new ElementBuffer({
      props : {
        ...this.getUnknownProperties(),
        id,
        style,
        className: [className, "ui", appearance, "tabs"]
      }
    });

    let { tabs, bar, barOn, children } = this.props;
    // normalize children to an array
    if (!Array.isArray(children)) {
      if (children) children = [children];
      else children = [];
    }

    // if we didn't get tabs, figure them out from our children
    if (!tabs) {
      tabs = children.filter(isATab);
    }
    // If no tabs, don't do any more processing
    if (!tabs || !tabs.length) {
      console.warn(this,".render(): can't figure out tabs from props.tabs or props.children.  Just returning children.");
      elements.append(children);
      return elements.render();
    }

    // if we didn't get a bar, see if we got one in our children
    if (!bar) {
      bar = children.filter(isATabbar)[0];
      if (bar) barOn = (children.indexOf(bar) === 0 ? "top" : "bottom");
    }
    // If we still don't have a bar, create one
    if (!bar) {
      const { barAppearance, barExtras } = this.props;
      const barProps = {
        tabs: tabs.map(getTabInfo).filter(Boolean),
        on: barOn,
        appearance: barAppearance,
        extras: barExtras
      };
      bar = React.createElement(Tabbar, barProps);
    }

    elements.append(tabs);
    elements.addOn(barOn, bar);

    return elements.render();
  }
}

export default SUITabs;

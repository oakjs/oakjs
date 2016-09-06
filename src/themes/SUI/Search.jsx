"use strict";
//////////////////////////////
//
//  <Search> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import { autobind } from "oak-roots/util/decorators";

import ElementBuffer from "./ElementBuffer";
import Input from "./Input";
import SUIModuleComponent from "./SUIModuleComponent";

import { getAlignClass } from "./constants";
import { renderError } from "./Input"
import { isElement, hasClass } from "./SUI";

const moduleProps = {
  source: PropTypes.any,                // default: false            Specify a Javascript object which will be searched locally
  apiSettings: PropTypes.object,        // default: (object)        Settings for API call.
  minCharacters: PropTypes.number,      // default: 1                Minimum characters to query for results
  transition: PropTypes.string,         // default: "fade"          Named transition to use when animating menu in and out. Fade and slide down are available without including ui transitions
  duration: PropTypes.number,           // default: 300              Duration of animation events
  maxResults: PropTypes.number,         // default: 7                Maximum results to display when using local and simple search, maximum category count for category search
  cache: PropTypes.bool,                // default: true            Caches results locally to avoid requerying server
  searchFullText: PropTypes.bool,       // default: true            Return local results that match anywhere inside your content
  fields: PropTypes.object,             // default: (object)        List mapping display content to JSON property, either with API or source.
  searchFields: PropTypes.array,        // default: (array)         Specify object properties inside local source object which will be searched
  hideDelay: PropTypes.number,          // default: 0                Delay before hiding results after search blur
  searchDelay: PropTypes.number,        // default: 100              Delay before querying results on inputchange
  easing: PropTypes.string,             // default: easeOutExpo      Easing equation when using fallback Javascript animation

  templates: PropTypes.object,          // default: (object)        Templates used to generate the HTML structures for search results

  // SUI Callbacks
  onSelect: PropTypes.func,             // Args: result, response   Callback on element selection by user. The first parameter includes
                                        //                          the filtered response results for that element. The function should
                                        //                          return false to prevent default action (closing search results
                                        //                          and selecting value).
  onResultsAdd: PropTypes.func,         // Args: html               Callback after processing element template to add HTML to results. Function should return false to prevent default actions.
  onSearchQuery: PropTypes.func,        // Args: query              Callback on search query
  onResults: PropTypes.func,            // Args: response           Callback on server response
  onResultsOpen: PropTypes.func,        // Args:                    Callback when results are opened
  onResultsClose: PropTypes.func,       // Args:                    Callback when results are closed
}



class SUISearch extends SUIModuleComponent {

  static defaultProps = {
    icon: "search",
  }

  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,

    value: PropTypes.any,

    placeholder: PropTypes.string,
    icon: PropTypes.any,
    inputAppearance: PropTypes.string,

    appearance: PropTypes.string,
    category: PropTypes.bool,

    disabled: PropTypes.bool,
    hidden: PropTypes.bool,
    loading: PropTypes.bool,
    readonly: PropTypes.bool,
    error: PropTypes.any,

    ...moduleProps
  };

  //////////////////////////////
  // Component lifecycle
  //////////////////////////////

  constructor() {
    super(...arguments);
  }

  componentDidMount() {
    super.componentDidMount();
  }

  componentDidUpdate(prevProps) {
    super.componentDidUpdate(...arguments);
  }


  //////////////////////////////
  // SUI Search Module Properties
  //////////////////////////////

  static moduleProps = moduleProps;

  tellModule(...args) {
    return this.$ref().search(...args);
  }

  setModuleProps(props = {}) {
    const { category } = this.props;
    if (!props.type && category) props.type = "category"
    super.setModuleProps(props);
  }

  //////////////////////////////
  // SUI Search Module Behaviors
  //////////////////////////////

  query() { this.tellModule("query"); return this; }
  cancelQuery() { this.tellModule("cancel query"); return this; }
  searchLocal(query) { this.tellModule("search local", query); return this; }
  searchRemote(query) { this.tellModule("search remote", query); return this; }
  searchObject(query, object, searchFields) { return this.tellModule("search object", query, object, searchFields); }

  getValue() { return this.tellModule("get value"); }
  setValue(value) { return this.tellModule("set value", value); }

  showResults() { this.tellModule("show results"); return this; }
  hideResults() { this.tellModule("hide results"); return this; }
  getResult(value) { return this.tellModule("get result", value); }
  generateResults(response) { this.tellModule("generate response", results); return this; }
  addResuls(html) { this.tellModule("add results", html); return this; }

  displayMessages(text, type) { this.tellModule("display messages", text, type); return this; }
  hasMinimumCharacters() { return this.tellModule("has minimum characters"); }

  isFocused() { return this.tellModule("is focused"); }
  isVisible() { return this.tellModule("is visible"); }
  isEmpty() { return this.tellModule("is empty"); }


  readCache(query) { this.tellModule("read cache", query); return this; }
  clearCache(query) { this.tellModule("clear cache", query); return this; }
  writeCache(query) { this.tellModule("write cache", query); return this; }
  destroy() { this.tellModule("destroy"); return this; }

  //////////////////////////////
  // Rendering
  //////////////////////////////

  render() {
    const {
      id, className, style,
      value,
      children,
      placeholder, icon, inputAppearance,
      appearance, category, align,
      hidden, disabled, loading, readonly, error
    } = this.props;

    // NOTE: we don't support children!!!
    if (children) throw new TypeError("SUI.Search.render():  child elements are not supported!");

    const elements = new ElementBuffer({
      props : {
        id,
        style,
        className: [className, "ui", appearance, getAlignClass(align),
                    { category, loading, hidden, disabled, "read-only": readonly, error },
                    "search"
                   ]
      }
    });

    const inputProps = {
      ...this.getUnknownProps(),
      type: "text",
      ref: "input",
      value,
      placeholder,
      icon,
      appearance: inputAppearance,
      inputAppearance: "prompt",
      disabled,
      readonly
    }
    elements.append(React.createElement(Input, inputProps));
    if (error) renderError(elements, error);

    // add any children
    if (children) elements.add(children);

    elements.appendWrapped("div", "results");

    return elements.render();
  }
}

// Install us to be created whenever a "Field" specifies `type=search`
import { registerFieldType } from "./Field";
registerFieldType("search", SUISearch);

export default SUISearch;

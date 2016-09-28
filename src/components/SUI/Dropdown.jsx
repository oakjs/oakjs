"use strict";
//////////////////////////////
//
//  <Dropdown> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import { autobind } from "oak-roots/util/decorators";

import { getPointingClass } from "./constants";

import ElementBuffer from "./ElementBuffer";
import SUIModuleComponent from "./SUIModuleComponent";
import Menu from "./Menu";

import "./Dropdown.less";

const moduleProps = {
  on: PropTypes.string,                   // default: "click"       Event used to trigger dropdown (Hover, Click, Custom Event).
  allowAdditions: PropTypes.bool,         // default: false         Whether search selection should allow users to add their own selections, works for single or multiselect.
  action: PropTypes.string,               // default: "activate"    "activate", "select", "combo", "nothing", "hide", function(text, value)
  match: PropTypes.string,                // default: "both"        When using search selection specifies how to match values.  "both", "value", "text"
  forceSelection: PropTypes.bool,         // default: true          Whether search selection will force currently selected choice when element is blurred.
  allowCategorySelection: PropTypes.bool, // default: false         Whether menu items with sub-menus (categories) should be selectable

  // multiple select settings
  useLabels: PropTypes.bool,              // default: true          Whether multiselect should use labels. Must be set to true when allowAdditions is true
  maxSelections: PropTypes.any,           // default: false         When set to a number, sets the maximum number of selections
  glyphWidth: PropTypes.number,           // default: 1.0714        Maximum glyph width, used to calculate search size. This is usually size of a "W" in your font in em
  label: PropTypes.any,                   // default: (object)      Allows customization of multi-select labels

  // "other" settings
  direction: PropTypes.string,            // default: "auto"        When set to auto determines direction based on whether dropdown can fit on screen. Set to upward or downward to always force a direction
  keepOnScreen: PropTypes.bool,           // default: true          Whether dropdown should try to keep itself on screen by checking whether menus display position in its context (Default context is page).
  context: PropTypes.any,                 // default: window        Element context to use when checking whether can show when keepOnScreen: true
  fullTextSearch: PropTypes.bool,         // default: false         Whether search selections should look for string match anywhere in string
  preserveHTML: PropTypes.bool,           // default: true          Whether HTML included in dropdown values should be preserved. (Allows icons to show up in selected value)
  sortSelect: PropTypes.bool,             // default: false         Whether to sort values when creating a dropdown automatically from a select element.
  showOnFocus: PropTypes.bool,            // default: true          Whether to show dropdown menu automatically on element focus
  allowTab: PropTypes.bool,               // default: true          Whether to allow the element to be navigable by keyboard, by automatically creating a tabindex
  transition: PropTypes.string,           // default: "auto"        Named transition to use when animating menu in and out. Defaults to slide down or slide up depending on dropdown direction
  duration: PropTypes.number,             // default: 200           Duration of animation events
  keys: PropTypes.object,                 // default: (object)      The keycode used to represent keyboard shortcuts.
  delay: PropTypes.object,                // default: (object)      ime in milliseconds to debounce show or hide behavior when on: hover is used, or when touch is used.


  // events
  onChange: PropTypes.func,               // Args: value, text, $choice   Is called after a dropdown value changes.
  onAdd: PropTypes.func,                  // Args: value, text, $choice   Is called after a dropdown selection is added using a multiple select dropdown, only receives the added value
  onRemove: PropTypes.func,               // Args: value, text, $choice   Is called after a dropdown selection is removed using a multiple select dropdown, only receives the removed value
  onLabelCreate: PropTypes.func,          // Args: $label                 Allows you to modify a label before it is added. Expects $label to be returned.
  onLabelRemove: PropTypes.func,          // Args: $label                 Called when a label is remove, return false; will prevent the label from being removed.
  onLabelSelect: PropTypes.func,          // Args: $selectedLabels        Is called after a label is selected by a user
  onNoResults: PropTypes.func,            // Args: searchValue            Is called after a dropdown is searched with no matching values
  onShow: PropTypes.func,                 // Args:                        Is called before a dropdown is shown. If false is returned, dropdown will not be shown.
  onHide: PropTypes.func,                 // Args:                        Is called before a dropdown is hidden. If false is returned, dropdown will not be hidden.

  // Remote settings, not currently tested
  apiSettings: PropTypes.any,
  fields: PropTypes.object,
  saveRemoteData: PropTypes.bool,

}


class SUIDropdown extends SUIModuleComponent {
  static defaultProps = {
    showArrow: true
  }

  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,

    value: PropTypes.any,
    text: PropTypes.string,
    placeholder: PropTypes.string,
    icon: PropTypes.any,
    children: PropTypes.any,

    selection: PropTypes.bool,
    multiple: PropTypes.bool,
    search: PropTypes.bool,

    type: PropTypes.string,             // "button", "link", "combo"
    appearance: PropTypes.string,       //
    showArrow: PropTypes.bool,
    pointing: PropTypes.string,
    inline: PropTypes.bool,

    disabled: PropTypes.bool,
    hidden: PropTypes.bool,
    readonly: PropTypes.bool,
    loading: PropTypes.bool,
    error: PropTypes.any,

    // proxied down to menu
    items: PropTypes.any, // TODO: array of (string|element), object, array of objects
    menuClassName: PropTypes.string,
    menuAppearance: PropTypes.string,

    ...moduleProps
  };

  //////////////////////////////
  // Component lifecycle
  //////////////////////////////

  constructor() {
    super(...arguments);

    // tuck value away in state
    if (!this.state) this.state = {};
    const { value } = this.props;
    if (value !== undefined) this.state.value = value;
  }

  componentDidMount() {
    super.componentDidMount();
  }

  componentWillUpdate(nextProps) {
    if (!this.valuesAreTheSame(this.state.value, nextProps.value)) {
      this._lastStateValue = this.state.value;
      this.setState( { value: nextProps.value });
    }
  }

  componentDidUpdate(prevProps) {
    super.componentDidUpdate(...arguments);
  }


  //////////////////////////////
  // Value manipulation
  //////////////////////////////

  valuesAreTheSame(value1, value2, delimiter = ",") {
    if (Array.isArray(value1)) value1 = value1.join(delimiter);
    if (Array.isArray(value2)) value2 = value2.sort().join(delimiter);
    return value1 === value2;
  }

  // Normalize `value` according to `multiple`
  //  - if `multiple` is `true`, we'll always return a NEW array (splitting by `delimiter` if necessary)
  //  - otherwise we'll return the value passed in.
  normalizeValue(value, multiple, delimiter = ",") {
    if (multiple) {
      if (value === null || value === undefined || value === "") return [];
      if (Array.isArray(value)) return [...value];
      if (typeof value === "string") return value.split(delimiter);
      return [value];
    }
    if (value === null || value === undefined || value === "") return undefined;
    return value;
  }


  //////////////////////////////
  // SUI Dropdown Module Properties
  //////////////////////////////

  static moduleProps = moduleProps;

  tellModule(...args) {
    this.$ref().dropdown(...args);
  }

  // Update `value` as parsimoniously as possible to minimize
  //  spurious `onChange` and `onAdd` et events.
  setModuleProps(props) {
    super.setModuleProps(props);

    const { multiple, delimiter } = this.props;

    let value = this.normalizeValue(this.state.value, multiple, delimiter);
    let lastValue = this.normalizeValue(this._lastStateValue, multiple, delimiter);

    if (this.valuesAreTheSame(value, lastValue)) return;

    if (!multiple) {
      if (lastValue) this.removeSelected(lastValue);
      this.setSelected(value);
    }
    else {
      // remove items which are in `lastValue` but not in `value`
      lastValue.filter(val => !value.includes(val) )
        .forEach( val => this.removeSelected(val) );

      // add items which are in `value` but not in `lastValue`
      value.filter(value => !lastValue.includes(value) )
        .forEach( value => this.setSelected(value) );
    }
    this._lastStateValue = value;
  }

  //////////////////////////////
  // SUI Dropdown Module Behaviors
  //////////////////////////////

  setupMenu() { return this.tellModule("setup menu") }
  refresh() { return this.tellModule("refresh") }
  toggle() { return this.tellModule("toggle") }
  show() { return this.tellModule("show") }
  hide() { return this.tellModule("hide") }
  clear() { return this.tellModule("hide") }
  hideOthers() { return this.tellModule("hide others") }

  setSelected(value) { return this.tellModule("set selected", value) }
  removeSelected(value) { return this.tellModule("remove selected", value) }
  setExactly(value) { return this.tellModule("set exactly", value) }
  setText(value) { return this.tellModule("set text", value) }
  setValue(value) { return this.tellModule("set value", value) }

  getText() { return this.tellModule("get text") }
  getValue() { return this.tellModule("get value") }
  getItem(value) { return this.tellModule("get item", value) }

  restoreDefaults() { return this.tellModule("restore defaults") }
  restoreDefaultText() { return this.tellModule("restore default text") }
  restoreDefaultValue() { return this.tellModule("restore default value") }
  saveDefaults() { return this.tellModule("save defaults") }


  bindTouchEvents() { return this.tellModule("bind touch events") }
  bindMouseEvents() { return this.tellModule("bind mouse events") }
  bindIntent() { return this.tellModule("bind intent") }
  unbindIntent() { return this.tellModule("unbind intent") }
  determineIntent() { return this.tellModule("determine intent") }
  determineSelectAction(text, value) { return this.tellModule("determine select action", text, value) }

  setActive() { return this.tellModule("set active") }
  setVisible() { return this.tellModule("set visible") }
  removeActive() { return this.tellModule("remove active") }
  removeVisible() { return this.tellModule("remove visible") }

  isSelection() { return this.tellModule("is selection") }
  isAnimated() { return this.tellModule("is animated") }
  isVisible() { return this.tellModule("is visible") }
  isHidden() { return this.tellModule("is hidden") }

  getDefaultText() { return this.tellModule("get default text") }
  getPlaceholderText() { return this.tellModule("get placeholder text") }

  //////////////////////////////
  // Our additions to SUI Module Behaviors
  //////////////////////////////

  //////////////////////////////
  // Rendering
  //////////////////////////////

  render() {
    if (this.props.hidden) return null;

    const {
      oid, id, className, style,
      type, selection, multiple, search,
      text, placeholder, icon, children,
      items, menuClassName, menuAppearance,
      appearance, showArrow, pointing, inline,
      hidden, disabled, readonly, error, loading
    } = this.props;

    const { value } = this.state;

    const elements = new ElementBuffer({
      props : {
        "data-oid": oid,
        id,
        style,
        className: [className, "ui", appearance, getPointingClass(pointing),
                    { inline, selection, multiple, search, hidden, disabled,
                      "read-only": readonly, error, loading },
                    "dropdown", type
                   ]
      }
    });

    if (icon) elements.appendIcon(icon);
    if (text != null) elements.appendWrapped("div", "text", text);
    if (showArrow) elements.appendIcon("dropdown");
    if (placeholder || selection) elements.appendWrapped("div", "default text", placeholder || "");

    if (items) {
      // pass all unknown properties on to Menu
      const menuProps = {
        ...this.getUnknownProps(),
        items,
        className: menuClassName,
        appearance: menuAppearance,
      }
      const menuElement = React.createElement(Menu, menuProps);
      elements.append(menuElement);
    }
    if (children) elements.append(children);

    return elements.render();
  }
}

export default SUIDropdown;

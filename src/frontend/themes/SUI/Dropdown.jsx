"use strict";

//////////////////////////////
//
//  <Dropdown> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

import SUIComponent from "./SUIComponent";
import Icon from "./Icon";
import Menu from "./Menu";
import Stub from "./Stub";

export default class SUIDropdown extends SUIComponent {
  static propTypes = {
    // Children are OK
//    children: PropTypes.arrayOf(PropTypes.element),

    //////////////////////////////
    // appearance
    //----------------------------
    // Is this item currently visible?
    visible: PropTypes.bool,

    // Is this item currently enabled?
    enabled: PropTypes.bool,

    // HTML element id
    id: PropTypes.string,

    // Arbitrary space-separated CSS class name(s)
    className: PropTypes.string,

    // Any space-delimited combination of:
    //    - `fluid`, `compact`, `large`, `small`
    appearance: PropTypes.string,

    // Show dropdown icon to the right?
    showArrow: PropTypes.bool,


    //////////////////////////////
    // button characteristics
    //----------------------------
    // Fixed title (doesn't work if we `selectable`?)
    title: PropTypes.string,

    // Placeholder text
    placeholder: PropTypes.string,

    // Icon for the dropdown itself.
    // See: http://semantic-ui.com/elements/icon.html
    icon: PropTypes.string,


    //////////////////////////////
    // header characteristics
    //----------------------------
    // header text
    header: PropTypes.string,

    // header icon
    headerIcon: PropTypes.string,


    //////////////////////////////
    // selection
    //----------------------------
    // If `true`, we show selection in the button
    selectable: PropTypes.bool,

    // If `true`, the item is multi-selectable.
    // NOTE: automatically turns `selectable` on if set.
    multiSelect: PropTypes.bool,


    //////////////////////////////
    // form integration
    //----------------------------
    // If set, we'll include a <input@hidden[name]> for a form.
    name: PropTypes.string,


    //////////////////////////////
    // searchability
    //----------------------------
    // If set, they can type to search in the field.
    searchable: PropTypes.bool,


    //////////////////////////////
    // programmatic menu items
    //----------------------------
    // Map of names of MenuItems to display.
    // Alternative to having nested `<Menu/>`.
    // Can be:  - delimited string (see `propTypes.itemDelimiter`)
    //          - array of string or { value, label } maps
    //          - map of { value: label }
    items: React.PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.object
    ]),

    // Delimiter for a list of string items.
    itemDelimiter: PropTypes.string,


    //////////////////////////////
    // event handlers
    //----------------------------

    // Bound handler to fire when a menu item is selected.
    onChange: PropTypes.func,

    // Bound handler to fire when a value is added to a multi-select dropdown.
    onAdded: PropTypes.func,

    // Bound handler to fire when a value is removed from a multi-select dropdown.
    onRemoved: PropTypes.func,
  };


  static defaultProps = {
    visible: true,
    enabled: true,
    showArrow: false,
    selectable: false,
    multiSelect: false,
    searchable: false,
    itemDelimiter: ",",
  };


  //////////////////////////////
  //  Lifecycle
  //////////////////////////////

  componentDidMount() {
    this.$ref().dropdown({
      onChange: this.onChange
    });
  }

  //////////////////////////////
  //  Event handlers
  //////////////////////////////

  // Dropdown value changed.
  onChange(value, textDelta/* , $textDelta */) {
    const { onChange } = this.props;
    if (onChange) onChange(value, textDelta);
  }

  // Item added to multiple select.
  onAdded(value, textDelta/* , $textDelta*/) {
    const { onAdded } = this.props;
    if (onAdded) onAdded(value, textDelta);
  }

  // Item added to multiple select.
  onRemove(value, textDelta/* , $textDelta*/) {
    const { onRemoved } = this.props;
    if (onRemoved) onRemoved(value, textDelta);
  }

  //////////////////////////////
  //  Rendering
  //////////////////////////////


  // Render className for our item element.
  renderClass() {
    const { enabled, multiSelect, selectable, searchable, className, appearance } = this.props;
    return classNames(
      "ui",
      {
        disabled: !enabled,
        multiple: multiSelect,
        selection: selectable || multiSelect,
        search: searchable,
        className
      },
      appearance,
      "dropdown"
    );
  }

  renderHiddenField() {
    const { name } = this.props;
    if (name) return <input type="hidden" name={name}/>;
  }

  renderIcon() {
    const { icon } = this.props;
    if (icon) return <Icon icon={icon}/>;
  }

  renderArrow() {
    const { showArrow } = this.props;
    if (showArrow) return <i className="dropdown icon"/>;
  }

  renderTextDisplay() {
    const { title, placeholder, selectable } = this.props;
    if (!title && !placeholder && !selectable) return undefined;

    let className = "text";
    let displayText = title;
    if (!title && placeholder) {
      className = "default text";
      displayText = placeholder;
    }
    return <div className={className}>{displayText}</div>;
  }

  renderItemsAndHeader() {
    const { items, itemDelimiter, header, headerIcon } = this.props;
    if (!items && !header) return undefined;
    const props = { items, itemDelimiter, header, headerIcon };
    return <Menu {...props}/>;
  }

  render() {
    const { visible } = this.props;
    if (!visible) return <Stub/>;

    const { id } = this.props;
    const props = {
      id,
      className: this.renderClass()
    };
    return (
      <div {...props}>
        {this.renderHiddenField()}
        {this.renderIcon()}
        {this.renderArrow()}
        {this.renderTextDisplay()}
        {this.renderItemsAndHeader()}
        {this.props.children}
      </div>
    );
  }
}

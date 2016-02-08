"use strict";
//////////////////////////////
//
//  <Checkbox> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import { autobind } from "core-decorators";

import { isElement, hasClass } from "./SUI";
import ElementBuffer from "./ElementBuffer";
import SUIModuleComponent from "./SUIModuleComponent";

import { renderError } from "./Input"
import "./Checkbox.css";

const moduleProps = {
  uncheckable: PropTypes.any,           // default: "auto"        Setting to true/false will determine whether an input will allow no selection.
                                        //                        Auto will set disallow this behavior only for radio boxes"
  fireOnInit: PropTypes.bool,           // default: true          Whether callbacks for checked status should be fired on init as well as change

  // SUI Callbacks
  onChange: PropTypes.func,             // Args:	input element   Callback after a checkbox is either checked or unchecked.

  beforeChecked: PropTypes.func,        // Args:	input element   Callback before a checkbox is checked. Can cancel change by returning `false`
  onChecked: PropTypes.func,            // Args:	input element   Callback after a checkbox is checked.

  beforeUnchecked: PropTypes.func,      // Args:	input element   Callback before a checkbox is unchecked. Can cancel change by returning `false`
  onUnchecked: PropTypes.func,          // Args:	input element   Callback after a checkbox is unchecked.

  beforeIndeterminate: PropTypes.func,  // Args:	input element   Callback before a checkbox is set to undeterminate. Can cancel change by returning `false`
  onIndeterminate: PropTypes.func,      // Args:	input element   Callback after a checkbox is set to undeterminate.

  beforeDeterminate: PropTypes.func,    // Args:	input element   Callback before a checkbox is set to determinate. Can cancel change by returning `false`
  onDeterminate: PropTypes.func,        // Args:	input element   Callback after a checkbox is set to determinate.

  onEnable: PropTypes.func,             // Args:	input element   Callback after a checkbox is enabled.
  onDisable: PropTypes.func,            // Args:	input element   Callback after a checkbox is disabled.
}



class SUICheckbox extends SUIModuleComponent {
  // Default type to create if not specified.
  // Use so we can subclass to `RadioButton` etc.
  static defaultType = "checkbox";

  // Signal to Field that we want to render the `label` ourselves.
  static wantsLabel = true;

  static defaultProps = {
    checkedValue: true,
  }

  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,

    checked: PropTypes.bool,            // default: false         Shows as checked
//    value: PropTypes.any,               // current value of the field
    checkedValue: PropTypes.any,        // logical `value` of the field when it is checked
    uncheckedvalue: PropTypes.any,      // logical `value` of the field when it is unchecked

    label: PropTypes.any,               // Label to display to the right of the element
    children: PropTypes.any,            // you shouldn't really use these...

    appearance: PropTypes.string,       // "fitted"
    type: PropTypes.string,             // "checkbox", "radio", "slider", "toggle"

    disabled: PropTypes.bool,
    hidden: PropTypes.bool,
    readonly: PropTypes.bool,
    error: PropTypes.any,
    intederminate: PropTypes.bool,      // default: false         Shows as indeterminate [-]

    ...moduleProps
  };

  //////////////////////////////
  // Component lifecycle
  //////////////////////////////

  constructor() {
    super(...arguments);

    // pull `checked` into state
    if (!this.state) this.state = {};
    this.state.checked = this.props.checked;
  }

  componentDidMount() {
    super.componentDidMount();

    const { checked, indeterminate } = this.props;
    if (checked) this.setChecked();
    if (indeterminate) this.setIndeterminate();
  }

  componentDidUpdate(prevProps) {
    super.componentDidUpdate(...arguments);

    // update checked and indeterminate setting if necessary
    const { checked, indeterminate } = this.props;
    if (checked !== prevProps.checked) {
      if (checked)  this.setChecked();
      else          this.setUnchecked();
    }
    if (indeterminate !== prevProps.indeterminate) {
      if (indeterminate)  this.setIndeterminate();
      else                this.setDeterminate();
    }
  }


  //////////////////////////////
  // SUI Checkbox Module Properties
  //////////////////////////////

  static moduleProps = moduleProps;

  tellModule(...args) {
    return this.$ref().checkbox(...args);
  }

  setModuleProps(props) {
//    props.checked = this.state.checked;
    super.setModuleProps(props);
  }

  //////////////////////////////
  // Syntactic sugar
  //////////////////////////////

  get checked() { return this.state.checked }

  get value() {
    if (this.checked) return this.props.checkedValue;
    return this.props.uncheckedValue;
  }


  //////////////////////////////
  // SUI Checkbox Module Behaviors
  //////////////////////////////

  isRadio() { return this.tellModule("is radio") }
  canChange() { return this.tellModule("can change") }

  toggle() { return this.tellModule("toggle") }
  check() { return this.tellModule("check") }
  uncheck() { return this.tellModule("uncheck") }
  setChecked() { return this.tellModule("set checked") }
  setUnchecked() { return this.tellModule("set unchecked") }
  isChecked() { return this.tellModule("is checked") }
  isUnchecked() { return this.tellModule("is unchecked") }
  shouldAllowCheck() { return this.tellModule("should allow check") }
  shouldAllowUncheck() { return this.tellModule("should allow uncheck") }
  canUncheck() { return this.tellModule("can uncheck") }

  indeterminate() { return this.tellModule("indeterminate") }
  determinate() { return this.tellModule("determinate") }
  setIndeterminate() { return this.tellModule("set indeterminate") }
  setDeterminate() { return this.tellModule("set determinate") }
  shouldAllowDeterminate() { return this.tellModule("should allow determinate") }
  shouldAllowIndeterminate() { return this.tellModule("should allow indeterminate") }

  enable() { return this.tellModule("enable") }
  disable() { return this.tellModule("disable") }   // ???
  setEnabled() { return this.tellModule("set enabled") }
  setDisable() { return this.tellModule("set disabled") }

  attachEvents(selector, behavior) { return this.tellModule("attach events", selector, behavior) }

  //////////////////////////////
  // Our additions to SUI Module Behaviors
  //////////////////////////////

  get value() {
    if (this.checked) return this.props.checkedValue;
    return this.props.uncheckedValue;
  }

  //////////////////////////////
  // Rendering
  //////////////////////////////

  getTypeClass() {
    const type = this.props.type || this.constructor.defaultType;

    if (!type || type === "checkbox") return "checkbox";
    return `${type} checkbox`;
  }

  render() {
    const {
      id, className, style,
      label, children,
      appearance, type,
      hidden, disabled, readonly, error
    } = this.props;

    const { value } = this.state;

    const elements = new ElementBuffer({
      props : {
        id,
        style,
        className: [className, "ui", appearance,
                    { hidden, disabled, "read-only": readonly, error },
                    this.getTypeClass()
                   ]
      }
    });

    const inputProps = {
      ...this.getUnknownProps(),
      type: "checkbox",
    }
    if (disabled) inputProps.disabled = true;
    if (readonly) inputProps.readOnly = true;
    elements.append(React.createElement("input", inputProps));

    if (label) elements.append(<label>{label}</label>);
    if (error) renderError(elements, error);

    // add any children
    if (children) elements.add(children);

    return elements.render();
  }
}

// Install us to be created whenever a "Field" specifies `type=checkbox`
import { registerFieldType } from "./Field";
registerFieldType("checkbox", SUICheckbox);


export default SUICheckbox;

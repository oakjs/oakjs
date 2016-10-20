"use strict";
//////////////////////////////
//
//  <Progress> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";

import ElementBuffer from "./ElementBuffer";
import SUIModuleComponent from "./SUIModuleComponent";


const moduleProps = {
  autoSuccess: PropTypes.bool,          // "Whether success state should automatically trigger when progress completes"
  showActivity: PropTypes.bool,         // "Whether progress should automatically show activity when incremented"
  limitValues: PropTypes.bool,          // "When set to true, values that calculate to above 100% or below 0% will be adjusted.
                                        //  When set to false, inappropriate values will produce an error."
  label: PropTypes.string,              // "Can be set to either to display progress as `percent` or `ratio`.
                                        //  Matches up to corresponding text template with the same name."
                                        //  NOTE: we translate this to `label` when sending props to SUI
  random: PropTypes.any,                // "When incrementing without value, sets range for random increment value"
  precision: PropTypes.number,          // "Decimal point precision for calculated progress"
  total: PropTypes.any,                 // "Setting a total value will make each call to increment get closer to this total
                                        //  (i.e. 1/20, 2/20 etc)"
                                        // "Setting to true or false will force autoplay."
  value: PropTypes.any,                 // "Sets current value, when total is specified, this is used to calculate a ratio of the total,
                                        //  with percent this should be the overall percent"

  // text strings which can substitute {value} {total} {percent} {left}
  // NOTE: these translate to `text : {...}` when being passed to SUI
  activeText: PropTypes.any,            // text to show when active
  errorText: PropTypes.any,             // text to show when error
  successText: PropTypes.any,           // text to show when success
  warningText: PropTypes.any,           // text to show when warning
  percentText: PropTypes.any,           // text to show for % completed
  ratioText: PropTypes.any,             // text to show for completion ratio

  // SUI callbacks
  onChange: PropTypes.func,             // Args: percent, value, total    "Callback on percentage change"
  onSuccess: PropTypes.func,            // Args: total                    "Callback on success state"
  onActive: PropTypes.func,             // Args: value, total             "Callback on active state"
  onError: PropTypes.func,              // Args: value, total             "Callback on error state"
  onWarning: PropTypes.func,            // Args: value, total             "Callback on warning state"
}



class SUIProgress extends SUIModuleComponent {

  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,

    children: PropTypes.any,

    appearance: PropTypes.string,     // "indicating", "inverted", "top attached", "bottom attached"
    showProgress: PropTypes.bool,
    color: PropTypes.string,
    size: PropTypes.string,

    // states
    state: PropTypes.string,          // "success", "error", "warning"
    disabled: PropTypes.bool,

    ...moduleProps
  };

  //////////////////////////////
  // Component lifecycle
  //////////////////////////////


  //////////////////////////////
  // SUI Progress Module Properties
  //////////////////////////////

  static moduleProps = moduleProps;

  // Convert "xText" properties to `text:{}` for sending in to SUI.embed()
  setModuleProps(props = {}) {
    Object.keys(props).forEach( key => {
      if (!key.endsWith("Text")) return;
      if (!props.text) props.text = {};
      const textProp = key.substr(0, key.length - 4);
      props.text[textProp] = props[key];
      delete props[key];
    });

    // if in warn or error state, make sure total and value agree
    const { state } = this.props;
    if (state === "warning" || state === "error") {
      if (props.total) props.value = props.total;
      else props.value = props.total = 1;
    }

    return super.setModuleProps(props);
  }

  tellModule(...args) {
    return this.$getElement().progress(...args);
  }

  //////////////////////////////
  // SUI Progress Module Behaviors
  //////////////////////////////

  increment(value){ this.tellModule("increment", value); }
  decrement(value){ this.tellModule("decrement", value); }

  setValue(value) { this.tellModule({ value }); }
  setTotal(total) { this.tellModule({ total }); }
  setPercent(percent) { this.tellModule({ percent }); }

  getValue() { return this.tellModule("get value") || 0 }
  getTotal() { return this.tellModule("get total") || 0 }
  getPercent() { return this.tellModule("get percent") || 0 }


  //////////////////////////////
  // Rendering
  //////////////////////////////

  render() {
    const {
      id, className, style,
      // content
      children,
      // labels
      activeText, errorText, successText, warningText,
      // appearance
      appearance, showProgress, color, size,
      // states
      disabled, state,
    } = this.props;

    // NOTE: we don't support children!!!
    if (children) throw new TypeError("SUI.Progress.render():  child elements are not supported!");

    const elements = new ElementBuffer({
      props : {
        ...this.getUnknownProps(),
        id,
        style,
        className: [className, "ui", appearance, color, size, state, { progress: showProgress, disabled}, "progress"]
      }
    });

    if (showProgress) elements.append(<div className="progress"/>);
    elements.wrap("div", "bar");

    // add label if we have any text settings
    if (activeText || errorText || successText || warningText) {
      let label;
      if (state === "warning") label = warningText;
      else if (state === "error") label = errorText;
      if (label) {
        elements.append(<div className="label">{label}</div>);
      }
      else {
        elements.append(<div className="label"/>);
      }
    }

    return elements.render();
  }
}

export default SUIProgress;

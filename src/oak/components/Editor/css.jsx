//////////////////////////////
// Editor.Control subclasses for dealing with CSS values
//
// TODO: select input on initial re-render after changing from auto -> num|value
// TODO: <Editor-select> to do options from map thing w/ simple select
// TODO: <Editor-CompositeControl> with splitValue() logic... ???
// TODO: <Editor-number> which rejects any non-number keystrokes + paste ???
// TODO: error handling for value
// TODO: !important ???
//////////////////////////////

import React, { PropTypes } from "react";

import { classNames, unknownProps, mergeProps, stringOrFn, boolOrFn } from "oak-roots/util/react";
import { definedProperties } from "oak-roots/util/object";

import Control, { Select, Text } from "./Control";

//import "./css.less";

const NUMBER_LENGTH_EXPRESSION = /^\s*(-?[0-9.]+)(px|em|rem|vh|vw|min|vmax|%)?\s*$/
const LENGTH_UNITS = [
  "auto", "-", "px", "%", "em", "rm", "-", "vh", "vw", "vmin", "vmax"
];

// Static <Select/> to return CSS-legal length types
export function CSSLengthType(props, context) {
  return (
    <select value={props.value||""} onChange={props.onChange}>
      <option value=""/>
      <option value="auto">auto</option>
      <option disabled/>
      <option value="px">px</option>
      <option value="%">%</option>
      <option value="em">em</option>
      <option value="rem">rem</option>
      <option disabled/>
      <option value="vh">vh</option>
      <option value="vw">vw</option>
      <option value="vmin">vmin</option>
      <option value="vmax">vmax</option>
    </select>
  );
}

// EITHER:  `""` / `undefined`
//     OR:  `"auto"
//     OR:  `"<number><lengthType>"`
export class CSSLength extends Control {
  onUnitsChanged(event) {
    const units = event.target.value;
    const current = this.splitValue();
    let value;
console.warn("onUnitsChanged", units);
    if (units === "") {
      value = undefined;
    }
    else if (units === "auto") {
      value = "auto";
    }
    else {
      value = (current && current.number || 0) + units;
    }
console.info(value);
    this.context.form.onChange(event, this, this.props.name, value);
  }

  onNumberChanged(event) {
    const number = parseFloat(event.target.value) || 0;
console.warn("onNumberChanged", number);
    const current = this.splitValue();
    let value;
    if (current.units) {
      value = number + current.units;
    }
    else {
      value = number + "px";
    }
console.info(value);
    this.context.form.onChange(event, this, this.props.name, value);
  }

  splitValue(value = this._props && this._props.value) {
    if (value === undefined || value === "") return undefined;

    if (value === "auto") return "auto";

    const numberMatch = (""+value).match(NUMBER_LENGTH_EXPRESSION);
    if (!numberMatch) return { error: `Invalid length value: '${value}'` };

    const [ match, number, units ] = numberMatch;
    return {
      number: parseFloat(number),
      units: units || "px"
    }
  }

  renderControl(props) {
    const value = this.splitValue(props.value);
// TODO: error
    if (value === undefined) return <CSSLengthType onChange={(event)=>this.onUnitsChanged(event)}/>;
    if (value === "auto") return <CSSLengthType value="auto" onChange={(event)=>this.onUnitsChanged(event)}/>;
    return (
      <span>
        <input type="number" style={{width:"5em", textAlign:"right"}} value={value.number||0} onChange={(event)=>this.onNumberChanged(event)}/>
        <CSSLengthType value={value.units} onChange={(event)=>this.onUnitsChanged(event)}/>
      </span>
    );
  }
}

// export all as one map
export default Object.assign({}, exports);

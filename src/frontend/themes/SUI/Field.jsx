//////////////////////////////
//
//	<Field> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";

import { getColumnsWidthClass } from "./constants";
import { unkownProperties } from "./SUI";

import ElementBuffer from "./ElementBuffer";
import Input from "./Input";


// Constructor strings we'll take over with special classes.
// Use `registerFieldType` to add to this list.
const SPECIAL_FIELD_TYPES = {}

export function getConstructorForType(type) {
  if (typeof type === "function") return type;

  // if we got a string, the default is to create an Input
  // check our SPECIAL_FIELD_TYPES map in case some other class
  // has registered that it should take over for that type.
  if (typeof type === "string") {
    const specialType = SPECIAL_FIELD_TYPES[type];
    return specialType || Input;
  }
  console.warn("SUIField getConstructorForType(",type,"): couldn't find valid constructor for specified type.");
  return undefined;
}

export default function SUIField(props) {
  const {
    label,
    fieldAppearance, columns, inline,
    type,
    hidden, disabled, readonly, required, error
  } = props;

  const elements = new ElementBuffer({
    props : {
      className: [ fieldAppearance, { inline, hidden, disabled, readonly, required, error },
                   getColumnsWidthClass(columns), "field"],
    }
  });

  if (label) elements.appendWrapped("div", "label", label);

  // if they specified a `type`, create an `input` (if type is a string)
  //  or whatever type they specified (assuming they specified a constructor)
//
//TODO: intercept type = "checkbox", etc to use our smarter elements?
//
  if (type) {
    const constructor = (typeof type === "string" ? Input : type);
    if (typeof constructor === function) {
      const inputProperties = unkownProperties(props, SUIField.propTypes);
      const inputElement = React.createElement(constructor, inputProperties);
      elements.append(inputElement);
    }
    else {
      console.warn("SUIField(",props,"): couldn't find valid constructor for type: ", type);
    }
  }

  // Add children in case they inlined elements
  if (children) elements.append(children);

  return elements.render();
}

// The following properties are intercepted and used by the field.
// Everything else is passed on to input, created if `type` is set.
SUIField.propTypes = {
  label: PropTypes.any,               // label text or element
  fieldAppearance: PropTypes.string,
  columns: PropTypes.number,
  inline: PropTypes.bool,
};

// add render() method so we get hot code reload.
SUIField.render = Function.prototype;

export default SUIField;

//////////////////////////////
//
//  <Field> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";

import { getColumnWidthClass } from "./constants";
import { unkownProperties } from "./SUI";

import SUIComponent from "./SUIComponent";
import ElementBuffer from "./ElementBuffer";
import Input from "./Input";


// Constructor strings we'll take over with special classes.
// Use `registerFieldType` to add to this list.
const SPECIAL_FIELD_TYPES = {
  "default": Input
}

// Register a type name to return a constructor when a Field is created
//  with that `type`.  e.g.:
//
//    import { registerFieldType } from "./Field";
//    registerFieldType("checkbox", MySpecialCheckboxConstructor);
//
export function registerFieldType(type, constructor) {
  SPECIAL_FIELD_TYPES[type] = constructor;
}

export function getInputConstructorForType(type) {
  if (!type) return undefined;

  // If a class or a function, just return that
  if (typeof type === "function") return type;

  // if we got a string, the default is to create an Input
  // check our SPECIAL_FIELD_TYPES map in case some other class
  // has registered that it should take over for that type.
  if (typeof type === "string") {
    return SPECIAL_FIELD_TYPES[type] || SPECIAL_FIELD_TYPES["default"];
  }
  console.warn("SUIField getConstructorForType(",type,"): couldn't find valid constructor for specified type.");
  return undefined;
}

const Field = class SUIField extends SUIComponent {
  // The following properties are intercepted and used by the field.
  // Everything else is passed on to input, created if `type` is set.
  static propTypes = {
    label: PropTypes.any,               // label text or element
    fieldAppearance: PropTypes.string,
    columns: PropTypes.number,
    inline: PropTypes.bool,
  };

  render() {
    const {
      label, children,
      fieldAppearance, columns, inline,
      type,
      hidden, disabled, readonly, required, error
    } = this.props;

    const elements = new ElementBuffer({
      props : {
        className: [ fieldAppearance, { inline, hidden, disabled, readonly, required, error },
                     getColumnWidthClass(columns), "field"],
      }
    });

    // are we constructing an input automatically?
    const constructor = getInputConstructorForType(type);

    if (label) {
      if (!constructor || !constructor.wantsLabel) {
        elements.appendWrapped("label", "label", label);
      }
    }

    // if they specified a `type`, create an `input` (if type is a string)
    //  or whatever type they specified (assuming they specified a constructor)
    if (type) {
      if (typeof constructor === "function") {
        // Pass all unknown properties on to the input element
        const inputProperties = this.getUnknownProps();
        if (constructor.wantsLabel) inputProperties.label = label;
        const inputElement = React.createElement(constructor, inputProperties);
        elements.append(inputElement);
      }
      else {
        console.warn(this,"render(): couldn't find valid constructor for type: ", type);
      }
    }

    // Add children in case they inlined an input
    if (children) elements.append(children);

    return elements.render();
  }

}
export default Field;

//////////////////////////////
// Editor.Component class
//
// Editor for a React.Component using PropTypes-patch to generate a schema.
//////////////////////////////

import { PropTypes } from "react";

// TODO: For loading purposes, PropTypes-patch has been globalized...
//import { schemaForComponent } from "oak-roots/PropTypes-patch";
import { getPath } from "oak-roots/util/path";

import Form from "./Form";

export default class ComponentEditor extends Form {
  static propTypes = {
    ...Form.propTypes,

    // add component we're editing, as a string (from `context.components`) or a `React.Component`.
    component: PropTypes.oneOf([
      PropTypes.string,
      PropTypes.instanceOf(React.Component)
    ]).isRequired;
  }

  // Get current components map from context.
  static contextTypes = {
    components: React.PropTypes.any,
  };


  // Return the component for this Editor
  get Component() {
    const { component } = this.props;
    if (!component) return undefined;

    // Ghetto-check for React.Component subclass.
    // If we don't have propTypes, we can't effecively work with the component.
    if (component.propTypes) return component;

    // Named component?
    if (typeof component === "string") {
      const { components } = this.context;
      if (!components) {
        console.warn(`ComponentEditor created without 'context.components' for ${component}`);
        return undefined;
      }
      else if (!components[component]) {
        console.warn(`ComponentEditor can't find named component ${component}`);
        return undefined;
      }
      return components[component];
    }
    console.warn(`ComponentEditor can't understand component`, component);
  }

  // Return JSON-schema associated with our Component.
  // TODO: how to cache this effectively?
  get schema() {
    return schemaForComponent(this.Component);
  }


  // Return schema properties to apply to a control specified by `controlName`.
  getPropsForControl(controlName) {
    const schema = this.schema;
    const props = getPath(controlName, schema && schema.properties);
    const required = schema && schema.required && schema.required[controlName];
    if (!props && !required) return undefined;

    // Munge the props
    const schemaProps = {
      ...props,
      required
    }

    return schemaProps;
  }


}


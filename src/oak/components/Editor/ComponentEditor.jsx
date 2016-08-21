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

    // Type of component we're editing, as a string (from `context.components`) or a `React.Component`.
    Component: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(React.Component)
    ]).isRequired
  }

  static defaultProps = {
    ...Form.defaultProps,
    controlProps: {
      labelOn: "left",
      labelProps: {
        style: {
          width: 200
        }
      }
    }
  }

  // Get current components map from context.
  static contextTypes = {
    components: React.PropTypes.any,
  };


  // Return the component for this Editor
  get Component() {
    const { Component } = this.props;
    if (!Component) return undefined;

    // Ghetto-check for React.Component subclass.
    // If we don't have propTypes, we can't effecively work with the component.
    if (Component.propTypes) return Component;

    // Named component?
    if (typeof Component === "string") {
      const { components } = this.context;
      if (!components) {
        console.warn(`ComponentEditor created without 'context.components' for ${Component}`);
        return undefined;
      }
      else if (!components[Component]) {
        console.warn(`ComponentEditor can't find named component ${Component}`);
        return undefined;
      }
      return components[Component];
    }
    console.warn(`ComponentEditor can't understand component`, Component);
  }

  // Return JSON-schema associated with our Component.
  // TODO: how to cache this effectively?
  get schema() {
    return schemaForComponent(this.Component);
  }

}


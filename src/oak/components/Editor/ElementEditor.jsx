//////////////////////////////
// Editor.ElementEditor class
// Editor for a `jsxElement` instance, using PropTypes-patch to generate a schema.
//
//  NOTE:  We assume that the element's type is relatively fixed (so we can cache `schema`, etc).
//////////////////////////////

import { Children, PropTypes } from "react";

import { debounce } from "oak-roots/util/decorators";
import { getPath, getParent, setPath } from "oak-roots/util/path";

// TODO: For loading purposes, PropTypes-patch has been globalized...
//import { schemaForComponent } from "oak-roots/PropTypes-patch";

import Form from "./Form";
import { Output, Text, Checkbox, } from "./Control";
import { Select, } from "./Select";

import "./ElementEditor.less";

export default class ElementEditor extends Form {
  static propTypes = {
    ...Form.propTypes,

    // Component element instance we're editing.
    element: PropTypes.object,

    // Controller which owns that element, for saving (e.g. `oak.editContext`)
    controller: PropTypes.object
  }

  static defaultProps = {
    ...Form.defaultProps,
    className: "ElementEditor",
    style: {
      padding: 10
    },
    controlProps: {
      labelOn: "left",
      labelProps: {
        style: {
          width: 80,
          wordWrap: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }
      }
    }
  }

  // Get current components map from context to map `component.type` to a React Component class.
  static contextTypes = {
    components: React.PropTypes.any,
  };


  // Cache `Component`, `schema` etc on load.
  constructor(props) {
    super(props);
    this.state = this.getComponentInfo(props.element);
  }

  // Update cache of `Component` and `schema` when props change.
  componentWillReceiveProps(nextProps) {
    if (this.props.element !== nextProps.element || !this.state.Component) {
      this.setState(this.getComponentInfo(nextProps.element));
    }
  }


  // Return `{ Component, schema, etc }` for specified element, which we'll cache in `state`.
  getComponentInfo(element) {
    let data, Component, schema, knownProperties, controls;
    if (element) {
      data = { ...element.props };
      Component = this.context && this.context.components[element.type];
      if (!Component) console.warn("<ElementEditor>: can't find Component for: ", element.type);

      schema = schemaForComponent(Component);

      // create controls for properties in the schema
      if (schema) {
      // Names of all known schema properties.
      knownProperties = Object.keys(schema.properties);

      controls = knownProperties
        .map( key => this.getControlForProperty(key, schema.properties[key]) )
        .filter(Boolean);

      // add a type <Output> to the beginning
        controls.unshift( <Output title="Component" value={element.type}/> );
      }
    }

    return { data, Component, schema, knownProperties, controls };
  }

  IGNORED_PROPERTIES = [
    "children", "oid", "data-oid"
  ]

  getControlForProperty(key, property) {
    // skip certain properties
    if (this.IGNORED_PROPERTIES.includes(key)) return undefined;
    if (property.type === "boolean") return <Checkbox name={key} title={property.title || key} />;
    if (property.enum) return <Select name={key} title={property.title || key} />;
    return <Text name={key} title={property.title || key} />;
  }


  // Return JSON-schema associated with our Component.
  get schema() {
    return this.state.schema;
  }

  // Return data which we'll edit in the form.
  get data() {
    return this.state && this.state.data;
  }

  // Return children from the schema, or from inline elements for an instance.
  mungeChildren(props) {
    // If children have been specified,
    //  assume this is a custom adaptation for a specific Component type.
    // Return the children as specified.
    if (props.children) return Children.toArray(props.children);

    const data = this.data;
    let children = this.state.controls || [];

    // add fields for any properties which are not in `knownProperties`.
    if (data && this.state.knownProperties) {
      const unknownControls = Object.keys(data)
        .map( key => {
          if (this.state.knownProperties.includes(key)) return;
          if (this.IGNORED_PROPERTIES.includes(key)) return;

          return this.getControlForProperty(key, { title: key, type: typeof data[key] });
        }).filter(Boolean)

      children = children.concat(unknownControls);
    }

    return children;
  }

  // If `currentValue` is the empty string, save as `undefined`.
  saveValueForControl(controlName, currentValue) {
    if (currentValue === "") return super.saveValueForControl(controlName, undefined);
    return super.saveValueForControl(controlName, currentValue);
  }

  // Update the UI to reflect change to the element after a short delay.
  @debounce(150)
  onFieldChanged(control, controlName, currentValue) {
    // If no controller, we can't update...
    if (!this.props.controller) return;

    // clone props and update the value
    oak.actions.setElementProps({
      context: this.props.controller,
      elements: [ this.props.element ],
      props: { ...this.data }
    });
  }
}


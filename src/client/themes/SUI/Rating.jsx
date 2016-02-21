"use strict";
//////////////////////////////
//
//  <Rating> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import { autobind } from "oak-roots/util/decorators";

import ElementBuffer from "./ElementBuffer";
import SUIModuleComponent from "./SUIModuleComponent";


const moduleProps = {
  rating: PropTypes.any,                // "A number representing the default rating to apply"
                                        //  NOTE: maps to Rating property `initialRating`
  max: PropTypes.number,                // "Maximum rating value"
                                        //  NOTE: maps to Rating property `maxRating`
  clearable: PropTypes.any,             // "By default a rating will be only clearable if there is 1 icon.
                                        //  Setting to true/false will allow or disallow a user to clear their rating"
  disabled: PropTypes.bool,             // "Whether to enable user's ability to rate"
                                        //  NOTE: maps to Rating property `interactive`
  // SUI callbacks
  onRate: PropTypes.func,               // Args: value    "Is called after user selects a new rating"
                                        // NOTE: if this returns falsy, it cancels the change.
}



class SUIRating extends SUIModuleComponent {

  static defaultProps = {
    icon: "star"
  }

  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,

    children: PropTypes.any,

    appearance: PropTypes.string,     // "mini", "tiny", "small", "medium", "large", "huge", "massive"
    icon: PropTypes.any,              // "star" or "heart"
    size: PropTypes.string,

    ...moduleProps
  };

  //////////////////////////////
  // Component lifecycle
  //////////////////////////////


  //////////////////////////////
  // SUI Rating Module Properties
  //////////////////////////////

  static moduleProps = moduleProps;

  // Convert "xText" properties to `text:{}` for sending in to SUI.embed()
  setModuleProps(props) {
    if (props.rating) {
      props.initialRating = props.rating;
      delete props.rating;
    }

    if (props.max) {
      props.maxRating = props.max;
      delete props.max;
    }

    if (props.disabled) {
      props.interactive = !props.disabled;
      delete props.disabled;
    }
    return super.setModuleProps(props);
  }

  tellModule(...args) {
    return this.$ref().rating(...args);
  }

  //////////////////////////////
  // SUI Rating Module Behaviors
  //////////////////////////////

  enable() { this.tellModule("enable") }
  disable() { this.tellModule("disable") }
  clear() { this.tellModule("clear rating") }

  getRating() { return this.tellModule("get rating") }
  setRating(rating) { this.tellModule("set rating", rating); }


  //////////////////////////////
  // Rendering
  //////////////////////////////

  render() {
    const {
      id, className, style,
      // content
      children,
      // appearance
      appearance, icon, size,
    } = this.props;

    // NOTE: we don't support children!!!
    if (children) throw new TypeError("SUI.Rating.render():  child elements are not supported!");

    const elements = new ElementBuffer({
      props : {
        ...this.getUnknownProps(),
        id,
        style,
        className: [className, "ui", appearance, icon, size, "rating"]
      }
    });
    return elements.render();
  }
}

export default SUIRating;

"use strict";
//////////////////////////////
//
//  <Embed> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import { autobind } from "core-decorators";

import { unknownProperties } from "./SUI";
import SUIModuleComponent from "./SUIModuleComponent";


const moduleProps = {
  // SUI generic embed settings
  icon: PropTypes.any,                  // "Specifies an icon to use with placeholder content"
  source: PropTypes.any,                // "Specifies a source to use, if no source is provided it will be
                                        //  determined from the domain of a specified url."
  url: PropTypes.any,                   // "Specifies a url to use for embed"
  placeholder: PropTypes.any,           // "Specifies a url to use for placeholder image"
  embedId: PropTypes.string,            // "Specifies an id value to replace with the {id} value found in templated urls"
                                        //  NOTE: we translate this to `id` when sending params to `SUI.embed()`.
  parameters: PropTypes.any,            // "Specify an object containing key/value pairs to add to the iframes GET parameters."

  // SUI video settings
  autoplay: PropTypes.any,              // "Default setting auto will only autoplay content when a placeholder is specified.
                                        // "Setting to true or false will force autoplay."
  color: PropTypes.any,                 // "Specifies a default chrome color with Vimeo or YouTube."
  hd: PropTypes.bool,                   // "Whether to prefer HD content"
  brandedUI: PropTypes.bool,            // "Whether to show networks branded UI like title cards, or after video calls to action."

  // SUI callbacks
  onCreate: PropTypes.func,             // Args: url    "Callback when iframe is generated"
  onDisplay: PropTypes.func,            // Args: none   "Whenever iframe contents is shown"
  onPlaceholderDisplay: PropTypes.func, // Args: none   Immeditable before Embed is removed from DOM
  onEmbed: PropTypes.func,              // Args: params "Callback when module parameters are determined. Allows you to
                                        //               adjust parameters at run time by returning a new parameters object."
}



class SUIEmbed extends SUIModuleComponent {

  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,

    appearance: PropTypes.string,
    aspectRatio: PropTypes.string,
    children: PropTypes.any,

    ...moduleProps
  };

  //////////////////////////////
  // Component lifecycle
  //////////////////////////////


  //////////////////////////////
  // SUI Embed Module Properties
  //////////////////////////////

  static moduleProps = moduleProps;

  // Convert "embedId" property to "id" for sending in to SUI.embed()
  setModuleProps(props) {
    if (props.embedId) {
      props.id = props.embedId;
      delete props.embedId;
    }
    return super.setModuleProps(props);
  }

  tellModule(...args) {
    return this.$ref().embed(...args);
  }

  //////////////////////////////
  // SUI Embed Module Behaviors
  //////////////////////////////

  change(source, id, url) {
    return this.tellModule("change", source, id, url);
  }

  reset() {
    return this.tellModule("reset");
  }

  show() {
    return this.tellModule("show");
  }

  hide() {
    return this.tellModule("hide");
  }

  getId() {
    return this.tellModule("get id");
  }

  getPlaceholder() {
    return this.tellModule("get placeholder");
  }

  getSource() {
    return this.tellModule("get source");
  }

  getType() {
    return this.tellModule("get type");
  }

  getUrl() {
    return this.tellModule("get url");
  }

  hasPlaceholder() {
    return this.tellModule("has placeholder");
  }

  destroy() {
    return this.tellModule("destroy");
  }




  //////////////////////////////
  // Rendering
  //////////////////////////////

  render() {
    const {
      id, className, style,
      // content
      children,
      // appearance
      appearance, aspectRatio,
    } = this.props;

    // NOTE: we ignore children!!!
    if (children) throw new TypeError("SUI.Embed.render():  child elements are not supported!");

    const props = {
      ...unknownProperties(this.props, this.constructor.propTypes),
      id,
      style,
      className: classNames(className, "ui", appearance, aspectRatio, "embed")
    }
    return React.createElement("div", props);
  }
}

export default SUIEmbed;

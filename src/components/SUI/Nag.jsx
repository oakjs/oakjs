"use strict";
//////////////////////////////
//
//  <Nag> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";

import { isElement, hasClass } from "./SUI";
import ElementBuffer from "./ElementBuffer";
import SUIModuleComponent from "./SUIModuleComponent";

const moduleProps = {
  cookie: PropTypes.string,             // default: false?    Name of the cookie to track the nag.
  value: PropTypes.any,                 // default: false?    Value of the cookie when they've dismissed the nag.
}



class SUINag extends SUIModuleComponent {
  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,

    appearance: PropTypes.string,
    inline: PropTypes.bool,

    ...moduleProps
  };

  //////////////////////////////
  // Component lifecycle
  //////////////////////////////

  //////////////////////////////
  // SUI Nag Module Properties
  //////////////////////////////

  static moduleProps = moduleProps;

  tellModule(...args) {
    return this.$getElement().nag(...args);
  }

  // Convert "cookie" property to "key" for sending in to nag()
  setModuleProps(props) {
    if (props && props.cookie) {
      props.key = props.cookie;
      delete props.cookie;
    }
    return super.setModuleProps(props);
  }


  //////////////////////////////
  // SUI Nag Module Behaviors
  //////////////////////////////

  show() { this.tellModule("show"); return this; }
  clear() { this.tellModule("clear"); return this; }
  refresh() { this.tellModule("refresh"); return this; }

  //////////////////////////////
  // Our additions to SUI Module Behaviors
  //////////////////////////////

  render() {
    const {
      id, className, style,
      children,
      appearance, inline,
    } = this.props;

    const elements = new ElementBuffer({
      props : {
        ...this.getUnknownProps(),
        id,
        style,
        className: [className, "ui", appearance, { inline }, "cookie nag" ]
      }
    });

    elements.append(children);
    elements.appendIcon("close");
    return elements.render();
  }
}


export default SUINag;

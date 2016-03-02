"use strict";
//////////////////////////////
//
//  Application root element.
//
//  Basically just here so we can grab the react router and give it to the app.
//
//////////////////////////////

import React, { PropTypes } from "react";

import app from "../app";

export default class AppRoot extends React.Component {
  static contextTypes = {
    router: PropTypes.any
  }

  componentWillMount() {
    if (super.componentWillMount) super.componentWillMount();
    app.router = this.context.router;
  }

  componentWillUnMount() {
    if (super.componentWillUnMount) super.componentWillUnMount();
    delete app.router;
  }

  render() {
    return <div className="oak root">{this.props.children}</div>;
  }
}


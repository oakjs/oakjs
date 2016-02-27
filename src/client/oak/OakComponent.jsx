//////////////////////////////
//
//  OakComponent
//
//  Normal react component which pulls available data from context
//
//////////////////////////////

import React, { PropTypes } from "react";

export default class OakComponent extends React.Component {
  // Pull context in so we can get components and other juicy stuffs.
  static contextTypes = {
    app: React.PropTypes.any,
    project: React.PropTypes.any,
    stack: React.PropTypes.any,
    card: React.PropTypes.any,
    components: React.PropTypes.any,
  };
}

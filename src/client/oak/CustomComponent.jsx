//////////////////////////////
//
//  CustomComponent
//
//  Normal react component which pulls available data from context
//
//////////////////////////////

import React, { PropTypes } from "react";

export default class CustomComponent extends React.Component {
  // Pull context in so we can get components.
  static contextTypes = {
    app: React.PropTypes.any,
    project: React.PropTypes.any,
    stack: React.PropTypes.any,
    card: React.PropTypes.any,
    components: React.PropTypes.any,
  };
}

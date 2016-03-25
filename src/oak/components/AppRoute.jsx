//////////////////////////////
//  AppRoute abstract class
//
//  Make all routes in the application descend from this so:
//  1) We will pass app/card/components/ etc down to all rendered components via context
//  2) `App._appRoute` gets set so we can refresh the screen when something changes.
//////////////////////////////


import React, { PropTypes } from "react";

import app from "../app";

export default class AppRoute extends React.Component {

  static childContextTypes = {
    app: PropTypes.any,
    project: PropTypes.any,
    section: PropTypes.any,
    card: PropTypes.any,
    components: PropTypes.any
  };

  getChildContext() {
    return {
      app,
      project: app.project,
      section: app.section,
      card: app.card,
      components: (app.card ? app.card.components : app.components)
    };
  }

  componentDidMount() {
    app._appRoute = this;
    this._isMounted = true;
  }

  componentWillUpdate() {
    delete app._appRoute;
    this._isMounted = false;
  }

  componentDidUpdate() {
    app._appRoute = this;
    this._isMounted = true;
  }

  componentWillUnmount() {
    delete app._appRoute;
    this._isMounted = false;
  }
}

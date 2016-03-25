//////////////////////////////
//  AppRoute abstract class
//
//  Make all routes in the application descend from this so:
//  1) We will pass app/page/components/ etc down to all rendered components via context
//  2) `App._appRoute` gets set so we can refresh the screen when something changes.
//////////////////////////////


import React, { PropTypes } from "react";

import app from "../app";

export default class AppRoute extends React.Component {
  static contextTypes = {
    router: PropTypes.any
  }

  static childContextTypes = {
    app: PropTypes.any,
    project: PropTypes.any,
    section: PropTypes.any,
    page: PropTypes.any,
    components: PropTypes.any
  };

  getChildContext() {
    return {
      app,
      project: app.project,
      section: app.section,
      page: app.page,
      components: (app.page ? app.page.components : app.components)
    };
  }

  componentWillMount() {
    app.router = this.context.router;
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
    delete app.router;
    delete app._appRoute;
    this._isMounted = false;
  }
}

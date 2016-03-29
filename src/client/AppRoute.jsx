//////////////////////////////
//  AppRoute abstract class
//
//  Make all routes in the application descend from this so:
//  1) We will pass oak/page/components/ etc down to all rendered components via context
//  2) `App._appRoute` gets set so we can refresh the screen when something changes.
//////////////////////////////


import React, { PropTypes } from "react";

import oak from "oak/oak";

export default class AppRoute extends React.Component {
  static contextTypes = {
    router: PropTypes.any
  }

  static childContextTypes = {
    oak: PropTypes.any,
    project: PropTypes.any,
    section: PropTypes.any,
    page: PropTypes.any,
    components: PropTypes.any
  };

  getChildContext() {
    return {
      oak,
      project: oak.project,
      section: oak.section,
      page: oak.page,
      components: (oak.page ? oak.page.components : oak.components)
    };
  }

  componentWillMount() {
    oak._router = this.context.router;
  }

  componentDidMount() {
    oak._appRoute = this;
    this._isMounted = true;
  }

  componentWillUpdate() {
    delete oak._appRoute;
    this._isMounted = false;
  }

  componentDidUpdate() {
    oak._appRoute = this;
    this._isMounted = true;
  }

  componentWillUnmount() {
    delete oak._router;
    delete oak._appRoute;
    this._isMounted = false;
  }
}

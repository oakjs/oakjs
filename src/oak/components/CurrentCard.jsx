import React, { PropTypes } from "react";
import Stub from "./Stub";

export default class CurrentCard extends React.Component {
  static contextTypes = {
    app: PropTypes.any,
  }

  componentDidMount() {
    app.cardComponent = this.refs.card;
  }

  componentDidUpdate() {
    app.cardComponent = this.refs.card;
  }

  componentWillUpdate() {
    delete app.cardComponent;
  }

  componentWillUnmount() {
    delete app.cardComponent;
  }

  render() {
    const card = this.context.app.card;
    if (!card) return false;
    return React.createElement(card.Component, { ref: "card" });
  }
}


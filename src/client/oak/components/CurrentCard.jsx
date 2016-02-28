import React, { PropTypes } from "react";
import Stub from "./Stub";

export default class CurrentCard extends React.Component {
  static contextTypes = {
    app: PropTypes.any,
  }

  componentDidMount() {
    app.card.component = this.refs.card;
  }

  componentWillUpdate() {
    delete app.card.omponent;
  }

  componentDidUpdate() {
    app.card.component = this.refs.card;
  }

  componentWillUnmount() {
    delete app.card.omponent;
  }

  render() {
    const card = this.context.app.card;
    if (!card) return <Stub/>;
    return React.createElement(card.ComponentConstructor, { ref: "card" });
  }
}


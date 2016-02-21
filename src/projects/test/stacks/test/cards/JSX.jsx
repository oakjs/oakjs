"use strict";
import React from "react";
import Card from "oak/Card";

export default class JSXCard extends Card {
  static defaultProps = {
    id: "JSX",
    title: "JSX Test"
  }

  // add render method so we get hot reload
  render() { return super.render() }

  // actual card render
  renderChildren({ data, card, stack, project, c }) {
    return (
      <c.Segment>
    		<span>JSX Test Card!</span>
    	</c.Segment>
    );
  }
}

"use strict";
import React from "react";
import { Card } from "oak";

export default class RailCard extends Card {
  static defaultProps = {
    id: "Rail",
    title: "Rail"
  }
  // add render method so we get hot reload
  render() { return super.render() }

  // actual card render
  renderChildren({ data, card, stack, project, c }) {
    return (
      <c.CardContainer>
        <c.PageSidebar/>
        <c.Page>
          <c.PageTitle title="Rail">
            A rail is used to show accompanying content outside the boundaries of the main view of a site.

            <c.Todo>Come up with some rail examples!</c.Todo>
          </c.PageTitle>

          <c.PageSection title="Types">

            <c.Example title=""></c.Example>

          </c.PageSection>

        </c.Page>
      </c.CardContainer>
    );
  }
}

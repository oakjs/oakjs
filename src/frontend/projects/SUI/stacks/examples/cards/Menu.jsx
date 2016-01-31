"use strict";
import React from "react";
import { Card } from "oak";

export default class MenuCard extends Card {
  static defaultProps = {
    id: "Menu",
    title: "Menu"
  }
  // add render method so we get hot reload
  render() { return super.render() }

  // actual card render
  renderChildren({ data, card, stack, project, c }) {
    return (
      <c.CardContainer>
        <c.PageSidebar/>
        <c.Page>
          <c.PageTitle title="Menu">
            A menu displays grouped navigation actions
          </c.PageTitle>

          <c.PageSection title="Types">

            <c.Example title="Normal Menu">

            </c.Example>

          </c.PageSection>

        </c.Page>
      </c.CardContainer>
    );
  }
}

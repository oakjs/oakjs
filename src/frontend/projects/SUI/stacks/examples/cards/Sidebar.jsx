"use strict";
import React from "react";
import { Card } from "oak";

export default class SidebarCard extends Card {
  static defaultProps = {
    id: "Sidebar",
    title: "Sidebar"
  }
  // add render method so we get hot reload
  render() { return super.render() }

  // actual card render
  renderChildren({ data, card, stack, project, c }) {
    return (
      <c.CardContainer>
        <c.PageSidebar/>
        <c.Page>
          <c.PageTitle title="Sidebar">
          </c.PageTitle>

          <c.PageSection title="">

            <c.Example title="">

...
            </c.Example>

          </c.PageSection>

        </c.Page>
      </c.CardContainer>
    );
  }
}

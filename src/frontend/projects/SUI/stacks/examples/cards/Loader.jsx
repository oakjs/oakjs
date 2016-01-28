"use strict";
import React from "react";
import { Card } from "oak";

export default class LoaderCard extends Card {
  static defaultProps = {
    id: "Loader",
    title: "Loader"
  }
  renderChildren({ data, card, stack, project, c }) {
    return (
      <c.CardContainer>
        <c.PageSidebar/>
        <c.Page>
          <c.PageTitle title="Loader">
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

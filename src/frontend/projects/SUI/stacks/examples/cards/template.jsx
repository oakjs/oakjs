"use strict";
import React from "react";
import { Card } from "oak";

export default class •Card extends Card {
  static defaultProps = {
    id: "•",
    title: "•"
  }
  render() {
    const c = this.components;
    return (
      <div {...this.renderProps}>
        <c.PageSidebar/>
        <c.Page>
          <c.PageTitle title="•">
          </c.PageTitle>

          <c.PageSection title="">

            <c.Example title="">

...
            </c.Example>

          </c.PageSection>

        </c.Page>
      </div>
    );
  }
}

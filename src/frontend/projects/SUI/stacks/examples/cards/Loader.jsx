"use strict";
import React from "react";
import { Card } from "oak";

export default class LoaderCard extends Card {
  static defaultProps = {
    id: "Loader",
    title: "Loader"
  }
  render() {
    const c = this.components;
    return (
      <div {...this.renderProps}>
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
      </div>
    );
  }
}

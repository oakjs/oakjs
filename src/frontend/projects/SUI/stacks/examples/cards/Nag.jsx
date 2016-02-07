"use strict";
import React from "react";
import { Card } from "oak";

export default class NagCard extends Card {
  static defaultProps = {
    id: "Nag",
    title: "Nag"
  }
  // add render method so we get hot reload
  render() { return super.render() }

  // actual card render
  renderChildren({ data, card, stack, project, c }) {
    return (
      <c.CardContainer>
        <c.PageSidebar/>
        <c.Page>
          <c.PageTitle title="Nag">
            A nag is an important message that persists until dismissed by a user
            <c.Bug>
              This component isn't working, not sure what's wrong.
              The <a href="">SUI documentation</a> indicates that it's not production ready (as of Feb 2015).
            </c.Bug>
          </c.PageTitle>

          <c.PageSection title="Usage">

            <c.Example title="Nag" hint="<Nag key='cookie-name'/>">
              <c.Nag ref='nag' inline key='nagCookie'>
                We use cookies to ensure you get the best experience on our website.
              </c.Nag>
              <c.Button onClick={()=> card.refs.nag.show()}>Show</c.Button>
              <c.Button onClick={()=> card.refs.nag.clear()}>Clear</c.Button>
              <c.Button onClick={()=> card.refs.nag.refresh()}>Refresh</c.Button>
            </c.Example>

          </c.PageSection>

        </c.Page>
      </c.CardContainer>
    );
  }
}

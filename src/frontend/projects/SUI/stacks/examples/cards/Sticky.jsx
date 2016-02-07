"use strict";
import React from "react";
import { Card } from "oak";

export default class StickyCard extends Card {
  static defaultProps = {
    id: "Sticky",
    title: "Sticky"
  }
  // add render method so we get hot reload
  render() { return super.render() }

  // actual card render
  renderChildren({ data, card, stack, project, c }) {
    return (
      <c.CardContainer>
        <c.PageSidebar/>
        <c.Page>
          <c.PageTitle title="Sticky">
            Sticky content fixes itself to the browser viewport as content is scrolled
            <c.Bug>Not sure why Sticky is disappearing on scroll, AFAICT it's set up correctly.</c.Bug>
            <c.Todo>
              <ul>
                <li>Other styles</li>
                <li>Events</li>
              </ul>
            </c.Todo>
          </c.PageTitle>

          <c.PageSection title="Sticky">
            <c.Rail internal left>
              <c.Sticky ref="leftSticky" bound context="#sticky">
                <c.Segment>
                  <c.LoremIpsum short/>
                </c.Segment>
              </c.Sticky>
            </c.Rail>

            <c.Rail internal right>
              <c.Sticky context="#sticky">
                <c.Segment>
                  <c.LoremIpsum short/>
                </c.Segment>
              </c.Sticky>
            </c.Rail>

            <c.Example id="sticky" title="Sticky" style={{marginLeft:350, marginRight:350}}>
              <c.LoremIpsum/>
              <c.LoremIpsum/>
              <c.LoremIpsum/>
              <c.LoremIpsum/>
              <c.LoremIpsum/>
              <c.LoremIpsum/>
              <c.LoremIpsum/>
            </c.Example>

          </c.PageSection>

        </c.Page>
      </c.CardContainer>
    );
  }
}

"use strict";
import React from "react";
import { Card } from "oak";

export default class SegmentsCard extends Card {
  static defaultProps = {
    id: "Segments",
    title: "Segments"
  }
  // add render method so we get hot reload
  render() { return super.render() }

  // actual card render
  renderChildren({ data, card, stack, project, c }) {
    return (
      <c.CardContainer>
        <c.PageSidebar/>
        <c.Page>
          <c.PageTitle title="Segments">
            A Segments is used to create a grouping of segments with similar appearance.
          </c.PageTitle>

          <c.PageSection title="Types">

            <c.Example title="Normal">
              <c.Grid columns={3}>
                <c.Column>
                  <c.Segments>
                    <c.Segment>Top</c.Segment>
                    <c.Segment>Middle</c.Segment>
                    <c.Segment>Middle</c.Segment>
                    <c.Segment>Middle</c.Segment>
                    <c.Segment>Bottom</c.Segment>
                  </c.Segments>
                </c.Column>

                <c.Column>
                  <c.Segments>
                    <c.Segment>Top</c.Segment>
                    <c.Segment color="red">Middle</c.Segment>
                    <c.Segment color="blue">Middle</c.Segment>
                    <c.Segment color="green">Middle</c.Segment>
                    <c.Segment color="yellow">Bottom</c.Segment>
                  </c.Segments>
                </c.Column>

                <c.Column>
                  <c.Segments>
                    <c.Segment appearance="inverted">Inverted</c.Segment>
                    <c.Segment appearance="secondary">Secondary</c.Segment>
                    <c.Segment>Normal</c.Segment>
                    <c.Segment>Normal</c.Segment>
                    <c.Segment appearance="tertiary">Tertiary</c.Segment>
                  </c.Segments>
                </c.Column>
              </c.Grid>
            </c.Example>

            <c.Example title="Horizontal" hint="<Segments horizontal/>">
              <c.Segments horizontal>
                <c.Segment>Left</c.Segment>
                <c.Segment>Right</c.Segment>
              </c.Segments>

              <c.Segments horizontal>
                <c.Segment>Left</c.Segment>
                <c.Segment>Center</c.Segment>
                <c.Segment>Right</c.Segment>
              </c.Segments>

              <c.Segments horizontal>
                <c.Segment>1</c.Segment>
                <c.Segment>2</c.Segment>
                <c.Segment>3</c.Segment>
                <c.Segment>4</c.Segment>
                <c.Segment>5</c.Segment>
              </c.Segments>
            </c.Example>

            <c.Example title="Nested">
              <c.Segments>
                <c.Segment>Top</c.Segment>
                <c.Segments>
                  <c.Segment>Nested Top</c.Segment>
                  <c.Segment>Nested Middle</c.Segment>
                  <c.Segment>Nested Bottom</c.Segment>
                </c.Segments>
                <c.Segment>Middle</c.Segment>
                <c.Segments horizontal>
                  <c.Segment>Left</c.Segment>
                  <c.Segment>Center</c.Segment>
                  <c.Segment>Right</c.Segment>
                </c.Segments>
                <c.Segment>Bottom</c.Segment>
              </c.Segments>
            </c.Example>

          </c.PageSection>

          <c.PageSection title="Appearance">
            <c.Example title="Raised" hint="<Segments appearance='raised'/>">
              <c.Segments appearance="raised">
                <c.Segment>Top</c.Segment>
                <c.Segment>Middle</c.Segment>
                <c.Segment>Bottom</c.Segment>
              </c.Segments>
            </c.Example>

            <c.Example title="Stacked" hint="<Segments appearance='stacked'/>">
              <c.Segments appearance="stacked">
                <c.Segment>Top</c.Segment>
                <c.Segment>Middle</c.Segment>
                <c.Segment>Bottom</c.Segment>
              </c.Segments>
            </c.Example>

            <c.Example title="Piled" hint="<Segments appearance='piled'/>">
              <c.Segments appearance="piled">
                <c.Segment>Top</c.Segment>
                <c.Segment>Middle</c.Segment>
                <c.Segment>Bottom</c.Segment>
              </c.Segments>
            </c.Example>

          </c.PageSection>

        </c.Page>
      </c.CardContainer>
    );
  }
}

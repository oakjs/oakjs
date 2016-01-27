"use strict";
import React from "react";
import { Card } from "oak";

export default class DividerCard extends Card {
  static defaultProps = {
    id: "Divider",
    title: "Divider"
  }
  renderChildren({ card, stack, project, c }) {
    return (
      <c.CardContainer>
        <c.PageSidebar/>
        <c.Page>
          <c.PageTitle title="Divider">
            A divider visually segments content into groups.
          </c.PageTitle>

          <c.PageSection title="Types">

            <c.Example title="Standard">
              <c.Segment>
                <c.LoremIpsum short/>
                <c.Divider/>
                <c.LoremIpsum short/>
              </c.Segment>
            </c.Example>

            <c.Example title="Vertical" hint="<Divider vertical>OR</Divider>">
              <c.Grid columns={3} appearance="very relaxed">
                <c.Column>
                  <c.LoremIpsum short/>
                </c.Column>
                <c.Divider vertical>Or</c.Divider>
                <c.Column>
                  <c.LoremIpsum short/>
                </c.Column>
                <c.Divider vertical>Or</c.Divider>
                <c.Column>
                  <c.LoremIpsum short/>
                </c.Column>
              </c.Grid>
            </c.Example>

            <c.Example title="Horizontal" hint="<Divider horizontal>...text...</Divider>">
              <c.Segment>
                <c.LoremIpsum short/>
                <c.Divider horizontal>And yet...</c.Divider>
                <c.LoremIpsum short/>
              </c.Segment>
            </c.Example>

            <c.Example title="Horizontal header" hint="<Divider horizontal header size='large'>...text...</Divider>">
              <c.Segment>
                <c.LoremIpsum short/>
                <c.Divider horizontal header size="large">And yet...</c.Divider>
                <c.LoremIpsum short/>
              </c.Segment>
            </c.Example>

          </c.PageSection>

          <c.PageSection title="Variations">

            <c.Example title="Fitted" hint="<Divider appearance='fitted'/>">
              <c.Segment>
                <c.LoremIpsum short/>
                <c.Divider appearance="fitted"/>
                <c.LoremIpsum short/>
              </c.Segment>
            </c.Example>

            <c.Example title="Section" hint="<Divider appearance='section'/>">
              <c.Segment>
                <c.LoremIpsum short/>
                <c.Divider appearance="section"/>
                <c.LoremIpsum short/>
              </c.Segment>
            </c.Example>

            <c.Example title="Hidden" hint="<Divider appearance='hidden'/>">
              <c.Segment>
                <c.LoremIpsum short/>
                <c.Divider appearance="hidden"/>
                <c.LoremIpsum short/>
              </c.Segment>
            </c.Example>

            <c.Example title="Clearing" hint="<Divider clearing/>  (Note: 'clearing' is true by default.)">
              <c.Segment>
                <c.Header floated="right">Floating Header</c.Header>
                <c.Divider/>
                <c.LoremIpsum short/>
              </c.Segment>
            </c.Example>

            <c.Example title="Inverted" hint="<Divider apperance='inverted'/>">
              <c.Segment appearance="inverted">
                <c.LoremIpsum short/>
                <c.Divider appearance="inverted"/>
                <c.LoremIpsum short/>
                <c.Divider horizontal appearance="inverted">Horizontal</c.Divider>
                <c.LoremIpsum short/>
              </c.Segment>
            </c.Example>

          </c.PageSection>

        </c.Page>
      </c.CardContainer>
    );
  }
}

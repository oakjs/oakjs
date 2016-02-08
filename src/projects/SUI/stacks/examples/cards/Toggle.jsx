"use strict";
import React from "react";
import { Card } from "oak";

export default class ToggleCard extends Card {
  static defaultProps = {
    id: "Toggle",
    title: "Toggle"
  }
  // add render method so we get hot reload
  render() { return super.render() }

  // actual card render
  renderChildren({ data, card, stack, project, c }) {
    return (
      <c.CardContainer>
        <c.PageSidebar/>
        <c.Page>
          <c.PageTitle title="Toggle">
            A toggle allows the user turn a setting on or off.
          </c.PageTitle>

          <c.PageSection title="States">

            <c.Columns>
              <c.Example title="Unchecked">
                <c.Toggle label="Unchecked Toggle"/>
              </c.Example>

              <c.Example title="Checked" hint="<Toggle checked/>">
                <c.Toggle checked label="Checked Toggle"/>
              </c.Example>
            </c.Columns>

            <c.Columns>
              <c.Example title="Read-only" hint="<Toggle readonly/>">
                <c.Toggle readonly label="Read-only Toggle"/>
              </c.Example>

              <c.Example title="Disabled" hint="<Toggle disabled/>">
                <c.Toggle disabled label="Disabled Toggle"/>
              </c.Example>
            </c.Columns>

            <c.Columns>
              <c.Example title="Hidden" hint="<Toggle hidden/>">
                <c.Toggle hidden label="Hidden Toggle"/>
              </c.Example>

              <c.Example title="Error" hint="<Toggle error/>">
                <c.Toggle error="Something went wrong" label="Error Toggle"/>
              </c.Example>
            </c.Columns>

          </c.PageSection>


          <c.PageSection title="Appearance">

            <c.Example title="Fitted" hint="<Toggle appearance='fitted'/>">
              <c.Segment appearance="left floated compact">
                <c.Toggle appearance="fitted"/>
              </c.Segment>
            </c.Example>
          </c.PageSection>

        </c.Page>
      </c.CardContainer>
    );
  }
}

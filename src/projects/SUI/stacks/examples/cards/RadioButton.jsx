"use strict";
import React from "react";
import Card from "oak/Card";

export default class RadioButtonCard extends Card {
  static defaultProps = {
    id: "RadioButton",
    title: "RadioButton"
  }
  // add render method so we get hot reload
  render() { return super.render() }

  // actual card render
  renderChildren({ data, card, stack, project, c }) {
    return (
      <c.CardContainer>
        <c.PageSidebar/>
        <c.Page>
          <c.PageTitle title="Radio Button">
            A radio button allows a user to select a single value from a small set of options
          </c.PageTitle>

          <c.PageSection title="States">

            <c.Columns>
              <c.Example title="Unchecked">
                <c.RadioButton label="Unchecked Radio Button"/>
              </c.Example>

              <c.Example title="Checked" hint="<RadioButton checked/>">
                <c.RadioButton checked label="Checked Radio Button"/>
              </c.Example>
            </c.Columns>

            <c.Columns>
              <c.Example title="Read-only" hint="<RadioButton readonly/>">
                <c.RadioButton readonly label="Read-only Radio Button"/>
              </c.Example>

              <c.Example title="Disabled" hint="<RadioButton disabled/>">
                <c.RadioButton disabled label="Disabled Radio Button"/>
              </c.Example>
            </c.Columns>

            <c.Columns>
              <c.Example title="Hidden" hint="<RadioButton hidden/>">
                <c.RadioButton hidden label="Hidden Radio Button"/>
              </c.Example>

              <c.Example title="Error" hint="<RadioButton error/>">
                <c.RadioButton error="Something went wrong" label="Error Radio Button"/>
              </c.Example>
            </c.Columns>

          </c.PageSection>

        </c.Page>
      </c.CardContainer>
    );
  }
}

"use strict";
import React from "react";
import { Card } from "oak";

export default class RadioGroupCard extends Card {
  static defaultProps = {
    id: "RadioGroup",
    title: "RadioGroup"
  }
  // add render method so we get hot reload
  render() { return super.render() }

  // actual card render
  renderChildren({ data, card, stack, project, c }) {
    return (
      <c.CardContainer>
        <c.PageSidebar/>
        <c.Page>
          <c.PageTitle title="RadioGroup">
            A RadioGroup allows the user to pick one of a mutually exclusive set of choices.
            <c.Info>RadioGroups may not display properly if not inside a Form</c.Info>
          </c.PageTitle>

          <c.PageSection title="Content">

            <c.Example title="RadioGroup">
              <c.Form>
                <c.RadioGroup value="a" options={{a:"Option a", b:"Option b", c:"Option c"}} label="Make a choice:"/>
              </c.Form>
            </c.Example>

          </c.PageSection>

          <c.PageSection title="States">
            <c.Columns>
              <c.Example title="No Initial Value" hint="<RadioGroup/>">
                <c.Form>
                  <c.RadioGroup options={{a:"Option a", b:"Option b", c:"Option c"}} label="Make a choice:"/>
                </c.Form>
              </c.Example>

              <c.Example title="Initial Value" hint="<RadioGroup value='...'/>">
                <c.Form>
                  <c.RadioGroup value='b' options={{a:"Option a", b:"Option b", c:"Option c"}} label="Make a choice:"/>
                </c.Form>
              </c.Example>
            </c.Columns>

            <c.Columns>
              <c.Example title="Read-only" hint="<RadioGroup readonly/>">
                <c.Form>
                  <c.RadioGroup readonly value='b' options={{a:"Option a", b:"Option b", c:"Option c"}} label="Make a choice:"/>
                </c.Form>
              </c.Example>

              <c.Example title="Disabled" hint="<RadioGroup disabled/>">
                <c.Form>
                  <c.RadioGroup disabled value='b' options={{a:"Option a", b:"Option b", c:"Option c"}} label="Make a choice:"/>
                </c.Form>
              </c.Example>
            </c.Columns>

            <c.Columns>
              <c.Example title="Hidden" hint="<RadioGroup hidden/>">
                <c.Form>
                  <c.RadioGroup hidden value='b' options={{a:"Option a", b:"Option b", c:"Option c"}} label="Make a choice:"/>
                </c.Form>
              </c.Example>

              <c.Example title="Error" hint="<RadioGroup error/>">
                <c.Form>
                  <c.RadioGroup error="Something went wrong" value='b' options={{a:"Option a", b:"Option b", c:"Option c"}} label="Make a choice:"/>
                </c.Form>
              </c.Example>
            </c.Columns>

          </c.PageSection>

          <c.PageSection title="Events">

            <c.Example title="Events" hint="<RadioGroup onChange='...'/>">
              <c.Form>
                <c.RadioGroup options={{a:"Option a", b:"Option b", c:"Option c"}} label="Make a choice:"
                  onChange={function(value){ console.warn("onChange(",value,") called with this as ",this)}}
                />
              </c.Form>
            </c.Example>

          </c.PageSection>

          <c.PageSection title="Appearance">

            <c.Example title="Inline" hint="<RadioGroup inline/>">
              <c.Form>
                <c.RadioGroup inline options={{a:"Option a", b:"Option b", c:"Option c"}} label="Make a choice:"/>
              </c.Form>
            </c.Example>

          </c.PageSection>

        </c.Page>
      </c.CardContainer>
    );
  }
}

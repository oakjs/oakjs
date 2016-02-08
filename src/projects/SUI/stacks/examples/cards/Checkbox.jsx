"use strict";
import React from "react";
import { Card } from "oak";

export default class CheckboxCard extends Card {
  static defaultProps = {
    id: "Checkbox",
    title: "Checkbox"
  }
  // add render method so we get hot reload
  render() { return super.render() }

  // actual card render
  renderChildren({ data, card, stack, project, c }) {
    return (
      <c.CardContainer>
        <c.PageSidebar/>
        <c.Page>
          <c.PageTitle title="Checkbox">
            A checkbox allows a user to select a value from a small set of options, often binary
          </c.PageTitle>

          <c.PageSection title="Types">

            <c.Columns>
              <c.Example title="Checkbox">
                <c.Checkbox label="Option a"/>
                <c.Spacer/>
                <c.Checkbox checked label="Option b"/>
                <c.Spacer/>
                <c.Checkbox indeterminate label="Option c"/>
              </c.Example>

              <c.Example title="Radio">
                <c.Checkbox type="radio" name="foo" label="Created with Checkbox component"/>
                <c.Spacer/>
                <c.RadioButton checked type="radio" label="Created wtih RadioButton component"/>
                <c.Info>Use the RadioGroup component for a linked group of radio buttons.</c.Info>
              </c.Example>
            </c.Columns>

            <c.Columns>
              <c.Example title="Toggle">
                <c.Checkbox type="toggle" label="Created with Checkbox component"/>
                <c.Spacer/>
                <c.Toggle checked type="toggle" label="Created with Toggle component"/>
                <c.Spacer/>
                <c.Toggle indeterminate type="toggle" label="Indeterminate toggle"/>
              </c.Example>

              <c.Example title="Slider">
                <c.Checkbox type="slider" label="Option a"/>
                <c.Spacer/>
                <c.Checkbox checked type="slider" label="Option b"/>
                <c.Spacer/>
                <c.Checkbox indeterminate type="slider" label="Indeterminate slider"/>
              </c.Example>
            </c.Columns>

          </c.PageSection>


          <c.PageSection title="States">

            <c.Columns>
              <c.Example title="Checked" hint="<Checkbox checked/>">
                <c.Checkbox checked label="Checked Checkbox"/>
                <c.Spacer/>
                <c.Checkbox checked type="radio" label="Checked Radio"/>
                <c.Spacer/>
                <c.Checkbox checked type="toggle" label="Checked Toggle"/>
                <c.Spacer/>
                <c.Checkbox checked type="slider" label="Checked Slider"/>
              </c.Example>

              <c.Example title="Indeterminate" hint="<Checkbox indeterminate/>">
                <c.Checkbox indeterminate label="Indeterminate Checkbox"/>
                <c.Spacer/>
                <c.Checkbox indeterminate type="radio" label="Indeterminate Radio"/>
                <c.Spacer/>
                <c.Checkbox indeterminate type="toggle" label="Indeterminate Toggle"/>
                <c.Spacer/>
                <c.Checkbox indeterminate type="slider" label="Indeterminate Slider"/>
              </c.Example>
            </c.Columns>

            <c.Columns>
              <c.Example title="Read-only" hint="<Checkbox readonly/>">
                <c.Checkbox readonly label="Read-only Checkbox"/>
                <c.Spacer/>
                <c.Checkbox readonly type="radio" label="Read-only Radio"/>
                <c.Spacer/>
                <c.Checkbox readonly type="toggle" label="Read-only Toggle"/>
                <c.Spacer/>
                <c.Checkbox readonly type="slider" label="Read-only Slider"/>
              </c.Example>

              <c.Example title="Disabled" hint="<Checkbox disabled/>">
                <c.Checkbox disabled label="Disabled Checkbox"/>
                <c.Spacer/>
                <c.Checkbox disabled type="radio" label="Disabled Radio"/>
                <c.Spacer/>
                <c.Checkbox disabled type="toggle" label="Disabled Toggle"/>
                <c.Spacer/>
                <c.Checkbox disabled type="slider" label="Disabled Slider"/>
              </c.Example>
            </c.Columns>

            <c.Columns>
              <c.Example title="Hidden" hint="<Checkbox hidden/>">
                <c.Checkbox hidden label="Hidden Checkbox"/>
                <c.Spacer/>
                <c.Checkbox hidden type="radio" label="Hidden Radio"/>
                <c.Spacer/>
                <c.Checkbox hidden type="toggle" label="Hidden Toggle"/>
                <c.Spacer/>
                <c.Checkbox hidden type="slider" label="Hidden Slider"/>
              </c.Example>

              <c.Example title="Error" hint="<Checkbox error/>">
                <c.Form>
                  <c.Checkbox error="Something went wrong" label="Error Checkbox"/>
                  <c.Spacer/>
                  <c.Checkbox error="Something went wrong" type="radio" label="Error Radio"/>
                  <c.Spacer/>
                  <c.Checkbox error="Something went wrong" type="toggle" label="Error Toggle"/>
                  <c.Spacer/>
                  <c.Checkbox error="Something went wrong" type="slider" label="Error Slider"/>
                </c.Form>
              </c.Example>
            </c.Columns>
          </c.PageSection>

          <c.PageSection title="Events">

            <c.Example title="Events" hint="<Checkbox onChange='...'/>">
              <c.Checkbox label="Check console for events"
                onChange={function(){console.log("onChange() called with this as ",this)}}
                beforeChecked={function(){console.log("beforeChecked() called with this as ",this)}}
                onChecked={function(){console.log("onChecked() called with this as ",this)}}
                beforeUnchecked={function(){console.log("beforeUnchecked() called with this as ",this)}}
                onUnchecked={function(){console.log("onUnchecked() called with this as ",this)}}
                beforeIndeterminate={function(){console.log("beforeIndeterminate() called with this as ",this)}}
                onIndeterminate={function(){console.log("onIndeterminate() called with this as ",this)}}
                beforeDeterminate={function(){console.log("beforeDeterminate() called with this as ",this)}}
                onDeterminate={function(){console.log("onDeterminate() called with this as ",this)}}
                onEnable={function(){console.log("onEnable() called with this as ",this)}}
                onDisable={function(){console.log("onDisable() called with this as ",this)}}
              />
            </c.Example>

          </c.PageSection>


          <c.PageSection title="Appearance">

            <c.Example title="Fitted" hint="<Checkbox appearance='fitted'/>">
              <c.Segment appearance="left floated compact">
                <c.Checkbox appearance="fitted"/>
              </c.Segment>
              <c.Segment appearance="left floated compact">
                <c.Checkbox appearance="fitted" type="toggle"/>
              </c.Segment>
              <c.Segment appearance="left floated compact">
                <c.Checkbox appearance="fitted" type="slider"/>
              </c.Segment>
            </c.Example>
          </c.PageSection>

        </c.Page>
      </c.CardContainer>
    );
  }
}

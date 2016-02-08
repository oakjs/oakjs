"use strict";
import React from "react";
import { Card } from "oak";

export default class StepsCard extends Card {
  static defaultProps = {
    id: "Steps",
    title: "Steps"
  }
  // add render method so we get hot reload
  render() { return super.render() }

  // actual card render
  renderChildren({ data, card, stack, project, c }) {
    return (
      <c.CardContainer>
        <c.PageSidebar/>
        <c.Page>
          <c.PageTitle title="Steps">
            Steps show the completion status of an activity in a series of activities.
          </c.PageTitle>

          <c.PageSection title="Types">

            <c.Example title="Single Step">
              <c.Steps>
                <c.Step description="Shipping"/>
              </c.Steps>
            </c.Example>

            <c.Example title="Steps">
              <c.Steps>
                <c.Step icon="truck" title="Shipping" description="Choose your shipping options"/>
                <c.Step icon="payment" active title="Billing" description="Enter billing information"/>
                <c.Step icon="info" title="Confirm Order"/>
              </c.Steps>
            </c.Example>

            <c.Example title="Ordered" hint="<Steps ordered/>">
              <c.Steps ordered>
                <c.Step completed title="Shipping" description="Choose your shipping options"/>
                <c.Step active title="Billing" description="Enter billing information"/>
                <c.Step title="Confirm Order"/>
              </c.Steps>
            </c.Example>

            <c.Example title="Vertical" hint="<Steps vertical/>">
              <c.Steps vertical>
                <c.Step completed icon="truck" title="Shipping" description="Choose your shipping options"/>
                <c.Step icon="payment" active title="Billing" description="Enter billing information"/>
                <c.Step icon="info" title="Confirm Order"/>
              </c.Steps>
            </c.Example>

          </c.PageSection>

          <c.PageSection title="Appearance">

            <c.Example title="Fluid" hint="<Steps appearance='fluid'/>">
              <c.Grid columns={2}>
                <c.Column>
                  <c.Steps vertical appearance="fluid">
                    <c.Step completed icon="soccer" title="Step 1" description="Collect Underpants"/>
                    <c.Step icon="help" active title="Step 2" description="???"/>
                    <c.Step icon="dollar" title="Step 3" description="Profit!"/>
                  </c.Steps>
                </c.Column>

                <c.Column>
                  <c.Segment>The steps on the left take up the whole column</c.Segment>
                </c.Column>
              </c.Grid>
            </c.Example>

            <c.Example title="Evenly divided" hint="<Steps quantity={4}/>">
              <c.Steps quantity={4}>
                <c.Step icon="truck" title="Shipping" description="Choose your shipping options"/>
                <c.Step icon="payment" active title="Billing" description="Enter billing information"/>
                <c.Step icon="info" title="Confirm Order"/>
              </c.Steps>

            </c.Example>

            <c.Example title="Stackable" hint="<Steps appearance='tablet stackable'/>">
              <c.Steps appearance="tablet stackable">
                <c.Step icon="truck" title="Shipping" description="Choose your shipping options"/>
                <c.Step icon="payment" active title="Billing" description="Enter billing information"/>
                <c.Step icon="info" title="Confirm Order"/>
              </c.Steps>
            </c.Example>

            <c.Example title="Attached" hint="<Steps appearance='top attached'/>">
              <c.Steps appearance="top attached" quantity={3}>
                <c.Step icon="truck" title="Shipping" description="Choose your shipping options"/>
                <c.Step icon="payment" active title="Billing" description="Enter billing information"/>
                <c.Step icon="info" title="Confirm Order"/>
              </c.Steps>
              <c.Segment appearance="attached">
                <c.LoremIpsum/>
              </c.Segment>
              <c.Steps appearance="bottom attached" quantity={3}>
                <c.Step icon="truck" title="Shipping" description="Choose your shipping options"/>
                <c.Step icon="payment" active title="Billing" description="Enter billing information"/>
                <c.Step icon="info" title="Confirm Order"/>
              </c.Steps>
            </c.Example>

            <c.Example title="Sizes" hint="<Steps size='small'/> or <Steps size='large'/>">
              <c.Steps size='small'>
                <c.Step icon="truck" title="Shipping" description="Choose your shipping options"/>
                <c.Step icon="payment" active title="Billing" description="Enter billing information"/>
                <c.Step icon="info" title="Confirm Order"/>
              </c.Steps>

              <c.Steps size='medium'>
                <c.Step icon="truck" title="Shipping" description="Choose your shipping options"/>
                <c.Step icon="payment" active title="Billing" description="Enter billing information"/>
                <c.Step icon="info" title="Confirm Order"/>
              </c.Steps>

              <c.Steps size='large'>
                <c.Step icon="truck" title="Shipping" description="Choose your shipping options"/>
                <c.Step icon="payment" active title="Billing" description="Enter billing information"/>
                <c.Step icon="info" title="Confirm Order"/>
              </c.Steps>
            </c.Example>

          </c.PageSection>

        </c.Page>
      </c.CardContainer>
    );
  }
}

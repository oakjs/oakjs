"use strict";
import React from "react";
import { Card } from "oak";

export default class StepCard extends Card {
  static defaultProps = {
    id: "Step",
    title: "Step"
  }
  // add render method so we get hot reload
  render() { return super.render() }

  // actual card render
  renderChildren({ data, card, stack, project, c }) {
    return (
      <c.CardContainer>
        <c.PageSidebar/>
        <c.Page>
          <c.PageTitle title="Step">
            A step shows the completion status of an activity in a series of activities
          </c.PageTitle>

          <c.PageSection title="Content">

            <c.Example title="Inline content">
              <c.Steps>
                <c.Step>
                  Shipping
                </c.Step>
              </c.Steps>
            </c.Example>

            <c.Example title="Title and Description">
              <c.Steps>
                <c.Step title="Shipping" description="Choose your shipping options"/>
              </c.Steps>
            </c.Example>

            <c.Example title="Icon">
              <c.Steps>
                <c.Step icon="truck" title="Shipping" description="Choose your shipping options"/>
              </c.Steps>
            </c.Example>

            <c.Example title="Link">
              <c.Steps>
                <c.Step link="http://www.ups.com" target="_blank" icon="truck" title="Shipping" description="Choose your shipping options"/>
              </c.Steps>
            </c.Example>

          </c.PageSection>

          <c.PageSection title="States">
            <c.Example title="Active">
              <c.Steps>
                <c.Step active icon="truck" title="Shipping" description="Choose your shipping options"/>
              </c.Steps>
            </c.Example>

            <c.Example title="Completed">
              <c.Steps>
                <c.Step completed icon="truck" title="Shipping" description="Choose your shipping options"/>
              </c.Steps>
            </c.Example>

            <c.Example title="Disabled">
              <c.Steps>
                <c.Step disabled icon="truck" title="Shipping" description="Choose your shipping options"/>
              </c.Steps>
            </c.Example>

          </c.PageSection>

        </c.Page>
      </c.CardContainer>
    );
  }
}

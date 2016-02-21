"use strict";
import React from "react";
import Card from "oak/Card";

export default class StatisticsCard extends Card {
  static defaultProps = {
    id: "Statistics",
    title: "Statistics"
  }
  // add render method so we get hot reload
  render() { return super.render() }

  // actual card render
  renderChildren({ data, card, stack, project, c }) {
    return (
      <c.CardContainer>
        <c.PageSidebar/>
        <c.Page>
          <c.PageTitle title="Statistics">
            A group of statistics
          </c.PageTitle>

          <c.PageSection title="Appearance">

            <c.Example title="Normal">
              <c.Statistics>
                <c.Statistic value="5,500" label="Downloads"/>
                <c.Statistic value="12,000" label="New Accounts"/>
                <c.Statistic value="32,129" label="Images Served"/>
              </c.Statistics>
            </c.Example>

            <c.Example title="Horizontal" hint="<Statistics appearance='horizontal'/>">
              <c.Statistics appearance="horizontal">
                <c.Statistic value="5,500" label="Downloads"/>
                <c.Statistic value="12,000" label="New Accounts"/>
                <c.Statistic value="32,129" label="Images Served"/>
              </c.Statistics>
            </c.Example>


            <c.Example title="Evenly Spaced" hint="<Statistics columns={3}/>">
              <c.Statistics columns={3}>
                <c.Statistic value="5,500" label="Downloads"/>
                <c.Statistic value="12,000" label="New Accounts"/>
                <c.Statistic value="32,129" label="Images Served"/>
                <c.Statistic value="213" label="Bugs Reported"/>
                <c.Statistic value="417" label="Bugs Fixed"/>
              </c.Statistics>
            </c.Example>

            <c.Example title="Sizes" hint="<Statistics size='small'/>">
              <c.Header appearance="dividing">Mini</c.Header>
              <c.Statistics size='mini'>
                <c.Statistic value="5,500" label="Downloads"/>
                <c.Statistic value="12,000" label="New Accounts"/>
                <c.Statistic value="32,129" label="Images Served"/>
              </c.Statistics>

              <c.Header appearance="dividing">Tiny</c.Header>
              <c.Statistics size='tiny'>
                <c.Statistic value="5,500" label="Downloads"/>
                <c.Statistic value="12,000" label="New Accounts"/>
                <c.Statistic value="32,129" label="Images Served"/>
              </c.Statistics>

              <c.Header appearance="dividing">Small</c.Header>
              <c.Statistics size='small'>
                <c.Statistic value="5,500" label="Downloads"/>
                <c.Statistic value="12,000" label="New Accounts"/>
                <c.Statistic value="32,129" label="Images Served"/>
              </c.Statistics>

              <c.Header appearance="dividing">Medium</c.Header>
              <c.Statistics size='medium'>
                <c.Statistic value="5,500" label="Downloads"/>
                <c.Statistic value="12,000" label="New Accounts"/>
                <c.Statistic value="32,129" label="Images Served"/>
              </c.Statistics>

              <c.Header appearance="dividing">Large</c.Header>
              <c.Statistics size='large'>
                <c.Statistic value="5,500" label="Downloads"/>
                <c.Statistic value="12,000" label="New Accounts"/>
                <c.Statistic value="32,129" label="Images Served"/>
              </c.Statistics>

              <c.Header appearance="dividing">Huge</c.Header>
              <c.Statistics size='huge'>
                <c.Statistic value="5,500" label="Downloads"/>
                <c.Statistic value="12,000" label="New Accounts"/>
                <c.Statistic value="32,129" label="Images Served"/>
              </c.Statistics>

            </c.Example>

          </c.PageSection>

        </c.Page>
      </c.CardContainer>
    );
  }
}

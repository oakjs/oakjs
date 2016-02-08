"use strict";
import React from "react";
import { Card } from "oak";

export default class TabsCard extends Card {
  static defaultProps = {
    id: "Tabs",
    title: "Tabs"
  }
  // add render method so we get hot reload
  render() { return super.render() }

  // actual card render
  renderChildren({ data, card, stack, project, c }) {
    return (
      <c.CardContainer>
        <c.PageSidebar/>
        <c.Page>
          <c.PageTitle title="Tabs">
            Tabs is a hidden section of content activated by a menu.
            <c.Todo>
              <ul>
                <li>Lots more examples.</li>
                <li>Loading stuff ???</li>
                <li>History stuff ???</li>
              </ul>
            </c.Todo>
          </c.PageTitle>

          <c.PageSection title="Content">

            <c.Example title="Normal">
              <c.Tabs ref="normal" active="a">
                <c.Tab name="a" title="A tab">
                  <c.Header>ZAAAAAAAYYYYYYY</c.Header>
                  <c.LoremIpsum short/>
                </c.Tab>
                <c.Tab name="b" title="B tab">
                  <c.Header>Bedebedebede</c.Header>
                  <c.LoremIpsum short/>
                </c.Tab>
              </c.Tabs>
            </c.Example>


            <c.Example title="Nested">
              <c.Tabs ref="nested1" active={2}>
                <c.Tab name="a" title="A tab">
                  <c.Header>AAAAAAAYYYYYYY</c.Header>
                  <c.Tabs ref="nestedA" barOn="top">
                    <c.Tab name="AA" title="A - A" active>B tab item A</c.Tab>
                    <c.Tab name="AB" title="A - B">B tab item B</c.Tab>
                  </c.Tabs>
                </c.Tab>
                <c.Tab name="b" title="B tab">
                  <c.Header>Bedebedebede</c.Header>
                  <c.Tabs ref="nestedB" barOn="top">
                    <c.Tab name="AA" title="B - A" active>B tab item A</c.Tab>
                    <c.Tab name="AB" title="B - B">B tab item B</c.Tab>
                  </c.Tabs>
                </c.Tab>
              </c.Tabs>
              <c.Bug>
                Nested tabs should have names of, eg, `a/B`, but that doesn't seem to work.
                Maybe it's because the outer context is looking in the inner tabs?
              </c.Bug>
            </c.Example>

          </c.PageSection>

        </c.Page>
      </c.CardContainer>
    );
  }
}

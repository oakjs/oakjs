"use strict";
import React from "react";
import { Card } from "oak";

export default class ContainerCard extends Card {
  static defaultProps = {
    id: "Container",
    title: "Container"
  }
  renderChildren({ card, stack, project, c }) {
    return (
      <c.CardContainer>
        <c.PageSidebar/>
        <c.Page>
          <c.PageTitle title="Container">
            <p>Containers limit content to a maximum width.
            <br/>Make this window very wide to see the effect.</p>
          </c.PageTitle>

          <c.PageSection title="Types">

            <c.Example title="Standard Container">
              <c.Container>
                <c.Header>Header</c.Header>
                <c.LoremIpsum/>
              </c.Container>
            </c.Example>

            <c.Example title="Text Container" hint="<Container appearance='text'/>">
              <c.Container appearance="text">
                <c.Header>Header</c.Header>
                <c.LoremIpsum/>
              </c.Container>
            </c.Example>

          </c.PageSection>

          <c.PageSection title="Variations">

            <c.Example title="Left | Center | Right Aligned" hint="<Container align='left'/>">
              <c.Container align="left">
                Left Aligned
              </c.Container>

              <c.Container align="center">
                Center Aligned
              </c.Container>

              <c.Container align="right">
                Right Aligned
              </c.Container>
            </c.Example>

            <c.Example title="Justified" hint="<Container align='justified'/>">
              <c.Container align="justified">
                <c.LoremIpsum/>
              </c.Container>
            </c.Example>

            <c.Example title="Fluid" hint="<Container appearance='fluid'/>">
              <c.Container appearance="fluid">
                <c.Header>Header</c.Header>
                <c.LoremIpsum/>
              </c.Container>
            </c.Example>

          </c.PageSection>

          <c.PageSection title="Combos">

            <c.Example title="Containers + Grids" hint="<Container appearance='four column grid'>">
              <c.Container appearance="four column grid">
               <div className="column"><c.LoremIpsum/></div>
               <div className="column"><c.LoremIpsum/></div>
               <div className="column"><c.LoremIpsum/></div>
               <div className="column"><c.LoremIpsum/></div>
              </c.Container>
            </c.Example>


            <c.Example title="Centering Menu in app header" hint="<Menu appearance='attached stackable'><Container/></Menu>">
              <c.Menu appearance="attached stackable">
                <c.Container>
                  <c.MenuItem icon="home" label="Home"/>
                  <c.MenuItem icon="grid layout" label="Browse"/>
                  <c.MenuItem icon="mail" label="Messages"/>

                  <c.MenuItem align="right" icon="settings" label="Settings"/>
                </c.Container>
              </c.Menu>
            </c.Example>


            <c.Example title="Containers and Segments" hint="<Segment appearance='...container'/>">
              <c.Segment appearance="raised very padded text container">
                <c.Header>Header</c.Header>
                <c.LoremIpsum/>
              </c.Segment>
            </c.Example>
          </c.PageSection>

        </c.Page>
      </c.CardContainer>
    );
  }
}

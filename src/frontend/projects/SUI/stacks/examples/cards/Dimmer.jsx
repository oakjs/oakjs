"use strict";
import React from "react";
import { Card } from "oak";

export default class DimmerCard extends Card {
  static defaultProps = {
    id: "Dimmer",
    title: "Dimmer"
  }

  // add render method so we get hot reload
  render() { return super.render() }

  // actual card render
  renderChildren({ data, card, stack, project, c }) {
    return (
      <c.CardContainer>
        <c.PageSidebar/>
        <c.Page>
          <c.PageTitle title="Dimmer">
            A dimmer hides distractions to focus attention on particular content.
          </c.PageTitle>

          <c.PageSection title="Types">

            <c.Example title="Simple">
              <c.Segment>
                <c.LoremIpsum/>
                <c.Dimmer visible/>
              </c.Segment>
            </c.Example>

            <c.Example title="Inline Content" hint="<Dimmer>...text...</Dimmer>">
              <c.Segment>
                <c.LoremIpsum/>
                <c.Dimmer visible>
                    Inline content here!
                </c.Dimmer>
              </c.Segment>
            </c.Example>

            <c.Example title="Content + Icon Attributes" hint="<Dimmer content='text' icon='icon'/>">
              <c.Segment>
                <c.LoremIpsum/>
                <c.Dimmer visible content="Content from attribute" icon="heart"/>
              </c.Segment>
            </c.Example>

            <c.Example title="Page Dimmer" hint="<Dimmer appearance='page'/>">
              <c.Dimmer ref="pageDimmer" appearance="page" content="I am the page dimmer!" closable/>
              <c.Button icon="plus" title="Show" onClick={()=>card.refs.pageDimmer.show()}/>
            </c.Example>
          </c.PageSection>


          <c.PageSection title="Appearance">

            <c.Example title="Inverted" hint="<Dimmer appearance='inverted'/>">
              <c.Segment>
                <c.LoremIpsum/>
                <c.Dimmer visible appearance="inverted" content="I am inverted!" icon="heart"/>
              </c.Segment>
            </c.Example>

            <c.Example title="Blurring" hint="<SomeContainer appearance='blurring'><Dimmer/>...container content...</SomeContainer>">
              <c.Message appearance="warning">
                <ul>
                  <li>If a dimmer starts our blurred and visible, it won't blur properly the first time.</li>
                  <li>Blurring doesn't work unless the dimmer is the FIRST ELEMENT in its container.</li>
                  <li>Blurring layers appear above page dimmers, which seems like a bug.</li>
                </ul>
              </c.Message>

              <c.Segment>
                <c.Dimmer visible appearance="blurring"/>
                <c.LoremIpsum/>
              </c.Segment>

              <c.Segment>
                <c.Dimmer visible appearance="inverted blurring" icon="heart" content="I love it when a plan comes together"/>
                <c.LoremIpsum/>
              </c.Segment>
            </c.Example>

          </c.PageSection>

          <c.PageSection title="States">

            <c.Example title="Normal (hidden)" hint="<Dimmer/>">
              <c.Segment>
                <c.LoremIpsum/>
                <c.Dimmer ref="normalDimmer"/>
              </c.Segment>
            </c.Example>

            <c.Example title="Start visible" hint="<Dimmer visible/>">
              <c.Segment>
                <c.LoremIpsum/>
                <c.Dimmer ref="visibleDimmer" visible/>
              </c.Segment>
            </c.Example>

            <c.Example title="Disabled" hint="<Dimmer disabled/>">
              <c.Segment>
                <c.LoremIpsum/>
                <c.Dimmer ref="disabledDimmer" disabled
                  onShow={() => console.warn("onShow() fired")}
                  onHide={() => console.warn("onHide() fired")}
                />
              </c.Segment>
            </c.Example>

          </c.PageSection>


          <c.PageSection title="Events">

            <c.Example title="onClick" hint="<Dimmer onClick={...func...}/>">
              <c.Segment appearance="basic unpadded">
                <c.Label ref="clickDimmerMessage" appearance="transparent"/>
                <c.Enablers for="clickDimmer" floated="right"/>
              </c.Segment>
              <c.Segment>
                <c.LoremIpsum/>
                <c.Dimmer ref="clickDimmer"
                  onClick={()=> card.refs.clickDimmerMessage.content = "onClick() called"}
                  onHide={()=> card.refs.clickDimmerMessage.content = ""}
                />
              </c.Segment>
            </c.Example>

            <c.Example title="onShow and onHide" hint="<Dimmer onShow={...func...} onHide={...func...}/>">
              <c.Segment appearance="basic unpadded">
                <c.Label ref="showHideDimmerMessage" appearance="transparent"/>
                <c.Enablers for="showHideDimmer" floated="right"/>
              </c.Segment>
              <c.Segment>
                <c.LoremIpsum/>
                <c.Dimmer ref="showHideDimmer"
                  onClick={()=> card.refs.showHideDimmerMessage.content = "onClick() called"}
                  onShow={()=> card.refs.showHideDimmerMessage.content = "onShow() called"}
                  onHide={()=> card.refs.showHideDimmerMessage.content = "onHide() called"}
                />
              </c.Segment>
            </c.Example>

            <c.Example title="onShow and onHide starting visible" hint="<Dimmer visible onShow={...func...} onHide={...func...}/>">
              <c.Segment appearance="basic unpadded">
                <c.Label ref="hideShowDimmerMessage" appearance="transparent"/>
                <c.Enablers for="hideShowDimmer" floated="right"/>
              </c.Segment>
              <c.Segment>
                <c.LoremIpsum/>
                <c.Dimmer ref="hideShowDimmer" visible
                  onClick={()=> card.refs.hideShowDimmerMessage.content = "onClick() called"}
                  onShow={()=> card.refs.hideShowDimmerMessage.content = "onShow() called"}
                  onHide={()=> card.refs.hideShowDimmerMessage.content = "onHide() called"}
                />
              </c.Segment>
            </c.Example>

            <c.Example title="Closable" hint="<Dimmer closable/>">
              <c.Segment appearance="basic unpadded">
                <c.Label ref="closableDimmerMessage" appearance="transparent"/>
                <c.Enablers for="closableDimmer" floated="right"/>
              </c.Segment>
              <c.Segment>
                <c.LoremIpsum/>
                <c.Dimmer ref="closableDimmer" closable visible content="Click to close me"
                  onClick={()=> card.refs.closableDimmerMessage.content = "onClick() called"}
                  onShow={()=> card.refs.closableDimmerMessage.content = ""}
                />
              </c.Segment>
            </c.Example>


          </c.PageSection>


        </c.Page>
      </c.CardContainer>
    );
  }
}

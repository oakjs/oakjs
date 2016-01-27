"use strict";
import React from "react";
import { Card } from "oak";

export default class DimmerCard extends Card {
  static defaultProps = {
    id: "Dimmer",
    title: "Dimmer"
  }
  renderChildren({ card, stack, project, c }) {
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
              <c.Dimmer id="pageDimmer" appearance="page" content="Hello!" closable>
                <c.Button icon="delete" title="Hide" appearance="primary" onClick={()=>$("#pageDimmer").dimmer("hide")}/>
              </c.Dimmer>
              <c.Button icon="plus" title="Show" onClick={()=>$("#pageDimmer").dimmer("show")}/>
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
                <c.Dimmer id="normalDimmer"/>
              </c.Segment>
              <c.Enablers id="normalDimmer"/>
            </c.Example>

            <c.Example title="Start visible" hint="<Dimmer visible/>">
              <c.Segment>
                <c.LoremIpsum/>
                <c.Dimmer id="visibleDimmer" visible/>
              </c.Segment>
              <c.Enablers id="visibleDimmer"/>
            </c.Example>

            <c.Example title="Disabled" hint="<Dimmer disabled/>">
              <c.Segment>
                <c.LoremIpsum/>
                <c.Dimmer id="disabledDimmer" disabled
                  onShow={c.Message.set("disabledDimmer-message", {message:"onShow() fired"})}
                  onHide={c.Message.set("disabledDimmer-message", {message:"onHide() fired"})}
                />
              </c.Segment>
              <c.Enablers id="disabledDimmer"/>
            </c.Example>

          </c.PageSection>


          <c.PageSection title="Events">

            <c.Example title="onShow and onHide" hint="<Dimmer onShow={...func...} onHide={...func...}/>">
              <c.Segment>
                <c.LoremIpsum/>
                <c.Dimmer id="showHideDimmer"
                  onShow={c.Message.flash("showHideMessage", "onShow() fired")}
                  onHide={c.Message.flash("showHideMessage", "onHide() fired")}
                />
              </c.Segment>
              <c.Message id='showHideMessage' message="No messages fired yet"/>
              <c.Buttons>
                <c.Button title="Show" onClick={c.Dimmer.set("showHideDimmer", {visible:true})}/>
                <c.Button title="Hide" onClick={c.Dimmer.set("showHideDimmer", {visible:false})}/>
              </c.Buttons>
            </c.Example>

            <c.Example title="onShow and onHide starting visible" hint="<Dimmer onShow={...func...} onHide={...func...}/>">
              <c.Segment>
                <c.LoremIpsum/>
                <c.Dimmer id="showHideDimmer2" visible
                  onShow={c.Message.flash("showHideMessage2", "onShow() fired")}
                  onHide={c.Message.flash("showHideMessage2", "onHide() fired")}
                />
              </c.Segment>
              <c.Message id='showHideMessage2' message="No messages fired yet"/>
              <c.Buttons>
                <c.Button title="Show" onClick={c.Dimmer.set("showHideDimmer2", {visible:true})}/>
                <c.Button title="Hide" onClick={c.Dimmer.set("showHideDimmer2", {visible:false})}/>
              </c.Buttons>
            </c.Example>
          </c.PageSection>

        </c.Page>
      </c.CardContainer>
    );
  }
}

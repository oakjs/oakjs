"use strict";
import React from "react";
import { Card } from "oak";

export default class DimmerCard extends Card {
  static defaultProps = {
    id: "Dimmer",
    title: "Dimmer"
  }
  render() {
    const c = this.components;
    return (
      <div {...this.renderProps}>
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
                <c.Dimmer/>
              </c.Segment>
            </c.Example>

            <c.Example title="Start visible" hint="<Dimmer visible/>">
              <c.Segment>
                <c.LoremIpsum/>
                <c.Dimmer visible/>
              </c.Segment>
            </c.Example>

            <c.Example title="Disabled" hint="<Dimmer disabled/>">
              <c.Segment>
                <c.LoremIpsum/>
                <c.Dimmer id="disabledDimmer" disabled/>
              </c.Segment>
              <c.Buttons>
                <c.Button title="Show" onClick={()=>c.Dimmer.show("disabledDimmer")}/>
                <c.Button title="Hide" onClick={()=>c.Dimmer.hide("disabledDimmer")}/>
              </c.Buttons>
              <c.Spacer inline/>
              <c.Buttons>
                <c.Button title="Enable" onClick={()=>c.Dimmer.enable("disabledDimmer")}/>
                <c.Button title="Disable" onClick={()=>c.Dimmer.disable("disabledDimmer")}/>
              </c.Buttons>
            </c.Example>

          </c.PageSection>


          <c.PageSection title="Events">

            <c.Example title="onShow and onHide" hint="<Dimmer onShow={...func...} onHide={...func...}/>">
              <c.Segment>
                <c.LoremIpsum/>
                <c.Dimmer id="showHideDimmer"
                  onShow={()=> $("#showHideMessage").html("Dimmer shown")}
                  onHide={()=> $("#showHideMessage").html("Dimmer hidden")}
                />
              </c.Segment>
              <c.Message id='showHideMessage'/>
              <c.Buttons>
                <c.Button title="Show" onClick={()=>c.Dimmer.show("showHideDimmer")}/>
                <c.Button title="Hide" onClick={()=>c.Dimmer.hide("showHideDimmer")}/>
              </c.Buttons>
            </c.Example>

            <c.Example title="onShow and onHide starting visible" hint="<Dimmer onShow={...func...} onHide={...func...}/>">
              <c.Segment>
                <c.LoremIpsum/>
                <c.Dimmer id="showHideDimmer2" visible
                  onShow={()=> $("#showHideMessage2").html("Dimmer shown")}
                  onHide={()=> $("#showHideMessage2").html("Dimmer hidden")}
                />
              </c.Segment>
              <c.Message id='showHideMessage2'/>
              <c.Buttons>
                <c.Button title="Show" onClick={()=>c.Dimmer.show("showHideDimmer2")}/>
                <c.Button title="Hide" onClick={()=>c.Dimmer.hide("showHideDimmer2")}/>
              </c.Buttons>
            </c.Example>
          </c.PageSection>

        </c.Page>
      </div>
    );
  }
}

"use strict";
import React from "react";
import Card from "oak/Card";

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
            <c.Todo>
              <ul>
                <li><i>active</i> vs <i>visible</i>, especially with loaders.</li>
                <li><i>loading</i> property to automatically add a loader?</li>
              </ul>
            </c.Todo>
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
              <c.Segment>
                <c.Dimmer visible appearance="blurring"/>
                <c.LoremIpsum/>
              </c.Segment>

              <c.Segment>
                <c.Dimmer visible appearance="inverted blurring" icon="heart" content="I love it when a plan comes together"/>
                <c.LoremIpsum/>
              </c.Segment>

              <c.Warning>Blurring doesn't work unless the dimmer is the FIRST ELEMENT in its container.</c.Warning>
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
              <c.Enablers ref="disabledEnabler" for="disabled" result="Initially disabled"/>
              <c.Segment>
                <c.LoremIpsum/>
                <c.Dimmer ref="disabled" disabled visible {...data.disabled}/>
              </c.Segment>
            </c.Example>

          </c.PageSection>


          <c.PageSection title="Events">

            <c.Example title="onClick" hint="<Dimmer onClick={...func...}/>">
              <c.Enablers for="click"/>
              <c.Segment>
                <c.LoremIpsum/>
                <c.Dimmer ref="click" visible id="click"
                  onClick={card.deferredSet("click.result", "onClick() called")}
                  {...data.click}
                />
              </c.Segment>
            </c.Example>

            <c.Example title="onShow and onHide" hint="<Dimmer onShow={...func...} onHide={...func...}/>">
              <c.Enablers for="showHide"/>
              <c.Segment>
                <c.LoremIpsum/>
                <c.Dimmer ref="showHide"
                  onClick={card.deferredSet("showHide.result", "onClick() called")}
                  onShow={card.deferredSet("showHide.result", "onShow() called")}
                  onHide={card.deferredSet("showHide.result", "onHide() called")}
                  {...data.showHide}
                />
              </c.Segment>
            </c.Example>

            <c.Example title="onShow and onHide starting visible" hint="<Dimmer visible onShow={...func...} onHide={...func...}/>">
              <c.Enablers for="hideShow"/>
              <c.Segment>
                <c.LoremIpsum/>
                <c.Dimmer ref="hideShow" visible {...data.hideShow}
                  onClick={card.deferredSet("hideShow.result", "onClick() called")}
                  onShow={card.deferredSet("hideShow.result", "onShow() called")}
                  onHide={card.deferredSet("hideShow.result", "onHide() called")}
                  {...data.hideShow}
                />
              </c.Segment>
            </c.Example>

            <c.Example title="onChange" hint="<Dimmer visible onChange={...func...}/>">
              <c.Enablers for="onChange"/>
              <c.Segment>
                <c.LoremIpsum/>
                <c.Dimmer ref="onChange" visible {...data.onChange}
                  onChange={card.deferredSet("onChange.result", "onChange() called")}
                  {...data.onChange}
                />
              </c.Segment>
            </c.Example>

            <c.Example title="Closable" hint="<Dimmer closable/>">
              <c.Enablers for="closable"/>
              <c.Segment>
                <c.LoremIpsum/>
                <c.Dimmer id="closable" ref="closable" closable visible content="Click to close me"
                  onClick={card.deferredSet("closable.result", "onClick() called")}
                  {...data.closable}
                />
              </c.Segment>
            </c.Example>


          </c.PageSection>


        </c.Page>
      </c.CardContainer>
    );
  }
}

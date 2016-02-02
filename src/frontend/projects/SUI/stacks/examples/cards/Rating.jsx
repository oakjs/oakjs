"use strict";
import React from "react";
import { Card } from "oak";

export default class RatingCard extends Card {
  static defaultProps = {
    id: "Rating",
    title: "Rating"
  }
  // add render method so we get hot reload
  render() { return super.render() }

  // actual card render
  renderChildren({ data, card, stack, project, c }) {
    return (
      <c.CardContainer>
        <c.PageSidebar/>
        <c.Page>
          <c.PageTitle title="Rating">
            A rating indicates user interest in content
          </c.PageTitle>

          <c.PageSection title="Types">
            <c.Grid columns={3}>
              <c.Column>
                <c.Example title="Single Rating">
                  <c.Rating max={1}/>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Star" hint="<Rating icon='star'/>">
                  <c.Rating icon="star" rating={2} max={5}/>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Heart" hint="<Rating icon='heart'/>">
                  <c.Rating icon="heart" rating={2} max={5}/>
                </c.Example>
              </c.Column>

            </c.Grid>
          </c.PageSection>

          <c.PageSection title="States">
            <c.Grid columns={3}>
              <c.Column>
                <c.Example title="Disabled" hint="<Rating disabled/>">
                  <c.Rating disabled rating={2} max={5}/>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Clearable" hint="<Rating clearable/>">
                  <c.Rating clearable rating={2} max={5}/>
                </c.Example>
              </c.Column>
            </c.Grid>
          </c.PageSection>

          <c.PageSection title="Events & Behaviors">
            <c.Example title="All events (look at console)" hint="<Rating onRate='...'/>">
              <c.Rating ref="events" icon="star" rating={card.get("events.value")} max={5}
                onRate={(value)=> {card.set("events.value", value)}}
              />
              <c.Spacer inline width={100}/>
              <c.Label content={card.get("events.value")}/>

              <c.Spacer/>
              <c.Buttons>
                <c.Button onClick={()=>card.refs.events.setRating(0)} title="0"/>
                <c.Button onClick={()=>card.refs.events.setRating(1)} title="1"/>
                <c.Button onClick={()=>card.refs.events.setRating(2)} title="2"/>
                <c.Button onClick={()=>card.refs.events.setRating(3)} title="3"/>
                <c.Button onClick={()=>card.refs.events.setRating(4)} title="4"/>
                <c.Button onClick={()=>card.refs.events.setRating(5)} title="5"/>
              </c.Buttons>

              <c.Spacer/>
              <c.Buttons>
                <c.Button onClick={()=>card.refs.events.enable()} title="Enable"/>
                <c.Button onClick={()=>card.refs.events.disable()} title="Disable"/>
                <c.Button onClick={()=>card.refs.events.clear()} title="Clear"/>
                <c.Button onClick={()=>card.set("events.content", card.refs.events.getRating())} title="getRating"/>
              </c.Buttons>
            </c.Example>
          </c.PageSection>


          <c.PageSection title="Appearance">
            <c.Example title="Sizes" hint="<Rating size='small'/>">
              <c.Label pointing="right" color="teal" style={{width:100}}>mini</c.Label><c.Rating size="mini"/>

              <c.Spacer/>
              <c.Label pointing="right" color="teal" style={{width:100}}>tiny</c.Label><c.Rating size="tiny"/>

              <c.Spacer/>
              <c.Label pointing="right" color="teal" style={{width:100}}>small</c.Label><c.Rating size="small"/>

              <c.Spacer/>
              <c.Label pointing="right" color="teal" style={{width:100}}>medium</c.Label><c.Rating size="medium"/>

              <c.Spacer/>
              <c.Label pointing="right" color="teal" style={{width:100}}>large</c.Label><c.Rating size="large"/>

              <c.Spacer/>
              <c.Label pointing="right" color="teal" style={{width:100}}>huge</c.Label><c.Rating size="huge"/>

              <c.Spacer/>
              <c.Label pointing="right" color="teal" style={{width:100}}>massive</c.Label><c.Rating size="massive"/>
            </c.Example>
          </c.PageSection>

        </c.Page>
      </c.CardContainer>
    );
  }
}

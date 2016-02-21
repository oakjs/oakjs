"use strict";
import React from "react";
import Card from "oak/Card";

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
            <c.Grid columns={2}>
              <c.Column>
                <c.Example title="Normal" hint="<Rating/>">
                  <c.Rating/>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Single Rating" hint="<Rating max={1}/>">
                  <c.Rating max={1}/>
                </c.Example>
              </c.Column>
            </c.Grid>
          </c.PageSection>

          <c.PageSection title="Content">
            <c.Grid columns={2}>
              <c.Column>
                <c.Example title="Initial Value" hint="<Rating rating={4}/>">
                  <c.Rating rating={2}/>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Max Value" hint="<Rating max={10}/>">
                  <c.Rating max={10}/>
                </c.Example>
              </c.Column>
            </c.Grid>
          </c.PageSection>

          <c.PageSection title="States, Events & Behaviors">
            <c.Grid columns={2}>
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

            <c.Example title="Events" hint="<Rating onRate='...'/>">
              <c.Rating ref="events" icon="star" rating={card.get("events.value")} max={5}
                onRate={(value)=> {card.set("events.value", value)}}
              />
              <c.Spacer inline width={100}/>
              <c.Label content={"value = "+card.get("events.value")}/>

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
              </c.Buttons>
            </c.Example>

          </c.PageSection>


          <c.PageSection title="Appearance">
            <c.Grid columns={2}>
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

            <c.Example title="Sizes" hint="<Rating size='small'/>">
              <c.Grid columns={3} style={{width:500}}>
                <c.Column>
                  <c.Label pointing="right" color="teal" style={{width:80}}>mini</c.Label>
                </c.Column>
                <c.Column>
                  <c.Rating size="mini"/>
                </c.Column>
                <c.Column>
                  <c.Rating size="mini" icon="heart"/>
                </c.Column>

                <c.Column>
                  <c.Label pointing="right" color="teal" style={{width:80}}>tiny</c.Label>
                </c.Column><c.Column>
                  <c.Rating size="tiny"/>
                </c.Column><c.Column>
                  <c.Rating size="tiny" icon="heart"/>
                </c.Column>

                <c.Column>
                  <c.Label pointing="right" color="teal" style={{width:80}}>small</c.Label>
                </c.Column><c.Column>
                  <c.Rating size="small"/>
                </c.Column><c.Column>
                  <c.Rating size="small" icon="heart"/>
                </c.Column>

                <c.Column>
                  <c.Label pointing="right" color="teal" style={{width:80}}>medium</c.Label>
                </c.Column><c.Column>
                  <c.Rating size="medium"/>
                </c.Column><c.Column>
                  <c.Rating size="medium" icon="heart"/>
                </c.Column>

                <c.Column>
                  <c.Label pointing="right" color="teal" style={{width:80}}>large</c.Label>
                </c.Column><c.Column>
                  <c.Rating size="large"/>
                </c.Column><c.Column>
                  <c.Rating size="large" icon="heart"/>
                </c.Column>

                <c.Column>
                  <c.Label pointing="right" color="teal" style={{width:80}}>huge</c.Label>
                </c.Column><c.Column>
                  <c.Rating size="huge"/>
                </c.Column><c.Column>
                  <c.Rating size="huge" icon="heart"/>
                </c.Column>

                <c.Column>
                  <c.Label pointing="right" color="teal" style={{width:80}}>massive</c.Label>
                </c.Column><c.Column>
                  <c.Rating size="massive"/>
                </c.Column><c.Column>
                  <c.Rating size="massive" icon="heart"/>
                </c.Column>
              </c.Grid>
            </c.Example>

          </c.PageSection>

        </c.Page>
      </c.CardContainer>
    );
  }
}

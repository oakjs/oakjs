"use strict";
import React from "react";
import { Card } from "oak";

export default class EmbedCard extends Card {
  static defaultProps = {
    id: "Embed",
    title: "Embed"
  }
  // add render method so we get hot reload
  render() { return super.render() }

  // actual card render
  renderChildren({ data, card, stack, project, c }) {
    return (
      <c.CardContainer>
        <c.PageSidebar/>
        <c.Page>
          <c.PageTitle title="Embed">
          </c.PageTitle>

          <c.PageSection title="Sources">
            <c.Example title="YouTube">
              <c.Embed source="youtube" embedId="pfdu_gTry8E" placeholder="http://semantic-ui.com/images/image-16by9.png"/>
            </c.Example>

            <c.Example title="Vimeo">
              <c.Embed source="vimeo" embedId="125292332" placeholder="http://semantic-ui.com/images/vimeo-example.jpg"/>
            </c.Example>

            <c.Example title="Custom Content">
              <c.Embed url='http://www.myfav.es/jack' icon='right circle arrow' placeholder="http://semantic-ui.com/images/image-16by9.png"/>
            </c.Example>
          </c.PageSection>

          <c.PageSection title="Behavior">
            <c.Example title="Change behavior" hint="<Embed aspectRatio='4:3'/>">
              <c.Embed ref='behavior' source="youtube" embedId="pfdu_gTry8E" placeholder="http://semantic-ui.com/images/image-16by9.png"/>
              <c.Spacer/>
              <c.Buttons>
                <c.Button onClick={()=> card.refs.behavior.change("youtube", "HTZudKi36bo")} title="Change"/>
                <c.Button onClick={()=> card.refs.behavior.reset()} title="Reset"/>
                <c.Button onClick={()=> card.refs.behavior.show()} title="Show"/>
                <c.Button onClick={()=> card.refs.behavior.hide()} title="Hide"/>
                <c.Button onClick={()=> card.refs.behavior.destroy()} title="Destroy"/>
              </c.Buttons>
              <c.Spacer/>
              <c.Buttons>
                <c.Button onClick={()=> console.log(card.refs.behavior.getId())} title="getId"/>
                <c.Button onClick={()=> console.log(card.refs.behavior.getPlaceholder())} title="getPlaceholder"/>
                <c.Button onClick={()=> console.log(card.refs.behavior.getSource())} title="getSource"/>
                <c.Button onClick={()=> console.log(card.refs.behavior.getType())} title="getType"/>
                <c.Button onClick={()=> console.log(card.refs.behavior.getUrl())} title="getUrl"/>
                <c.Button onClick={()=> console.log(card.refs.behavior.hasPlaceholder())} title="hasPlaceholder"/>
              </c.Buttons>
            </c.Example>
          </c.PageSection>

          <c.PageSection title="Appearance">
            <c.Grid columns={2}>
              <c.Column>
                <c.Example title="Aspect Ratio" hint="<Embed aspectRatio='4:3'/>">
                  <c.Embed aspectRatio='4:3' source="youtube" embedId="HTZudKi36bo" placeholder="http://semantic-ui.com/images/4by3.jpg"/>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Icon" hint="<Embed icon='...'/>">
                  <c.Embed url="#" icon='chevron right' placeholder="http://semantic-ui.com/images/image-16by9.png"/>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Color" hint="<Embed color='...'/>">
                  <c.Embed source="youtube" embedId="pfdu_gTry8E" autoplay={false} color="#cc00cc"/>
                  <c.Bug>Not sure how this is supposed to work...</c.Bug>
                </c.Example>
              </c.Column>

            </c.Grid>
          </c.PageSection>


        </c.Page>
      </c.CardContainer>
    );
  }
}

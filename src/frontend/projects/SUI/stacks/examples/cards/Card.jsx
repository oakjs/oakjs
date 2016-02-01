"use strict";
import React from "react";
import { Card } from "oak";

export default class CardCard extends Card {
  static defaultProps = {
    id: "Card",
    title: "Card"
  }

  getInitialData() {
    return {
      image: "http://semantic-ui.com/images/wireframe/image.png",
      joeAvatar: "http://semantic-ui.com/images/avatar/large/joe.jpg",
      kristyAvatar: "http://semantic-ui.com/images/avatar2/large/kristy.png",
      elliotAvatar: "http://semantic-ui.com/images/avatar/large/elliot.jpg",
      stevieAvatar: "http://semantic-ui.com/images/avatar/large/stevie.jpg",
    }
  }

  // add render method so we get hot reload
  render() { return super.render() }

  // actual card render
  renderChildren({ data, card, stack, project, c }) {
    return (
      <c.CardContainer>
        <c.PageSidebar/>
        <c.Page>
          <c.PageTitle title="Card">
            A card displays site content in a manner similar to a playing card
          </c.PageTitle>

          <c.PageSection title="Content">

            <c.Grid columns={2}>
              <c.Column>
                <c.Example title="Inline Content">
                  <c.Card>
                    <c.Image src={data.kristyAvatar}/>
                    <c.Content>
                      <c.Header>Kristy</c.Header>
                      <c.Meta>Joined in 2013</c.Meta>
                      <c.Description>
                        Kristy is an art director living in New York.
                      </c.Description>
                    </c.Content>
                    <c.Content appearance="extra">
                      <a><c.Icon icon="user"/>22 Friends</a>
                    </c.Content>
                  </c.Card>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Attributes">
                  <c.Card header="Kristy" meta="Joined in 2013"
                    description="Kristy is an art director living in New York."
                    extra={<a><c.Icon icon="user"/>22 Friends</a>}
                    image={data.kristyAvatar}
                  />
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Another example">
                  <c.Card>
                    <c.Content>
                      <c.Image src={data.elliotAvatar} appearance="avatar"/>
                      Elliot
                      <c.Meta floated="right">14h</c.Meta>
                    </c.Content>
                    <c.Image src={data.image}/>
                    <c.Content>
                      <span style={{float: "right"}}><c.Icon icon="heart outline"/>17 likes</span>
                      <span><c.Icon icon="comment"/>3 comments</span>
                    </c.Content>
                    <c.Content appearance="extra">
                      <c.Input appearance="large transparent" icon="open heart" iconOn="left" placeholder="Add comment..."/>
                    </c.Content>
                  </c.Card>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Yet Another Example">
                  <c.Card header="Elliot" meta="Friend of Veronika"
                    description="Elliot requested permisson to view your contact details"
                    headerImage={<c.Image src={data.elliotAvatar} floated="right" size="mini"/>}
                    extra={<c.Buttons count={2}>
                            <c.Button appearance="basic" color="green">Approve</c.Button>
                            <c.Button appearance="basic" color="red">Decline</c.Button>
                          </c.Buttons>}
                  />
                </c.Example>
              </c.Column>



              <c.Column>
                <c.Example title="Image with Reveal">
                  <c.Card header="Team Jones & Fu" meta="Established 2012"
                    childrenOn="top"
                  >
                    <c.Reveal effect="slide">
                      <c.Image src={data.joeAvatar}/>
                      <c.Image src={data.elliotAvatar}/>
                    </c.Reveal>
                  </c.Card>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Image with Dimmer">
                  <c.Card header="Team Jones & Fu" meta="Established 2012"
                    childrenOn="top"
                  >
                   <c.Image src={data.joeAvatar} appearance="dimmable"/>
                  </c.Card>
                  <c.Todo>How to do dimmable?</c.Todo>
                </c.Example>
              </c.Column>

            </c.Grid>

          </c.PageSection>

        </c.Page>
      </c.CardContainer>
    );
  }
}

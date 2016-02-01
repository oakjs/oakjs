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
      whiteImage: "http://semantic-ui.com/images/wireframe/white-image.png",

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
                <c.Example title="Link">
                  <c.Card header="Alphabet Inc" meta="NASDAQ: GOOG"
                    description="Alphabet Inc. is an American multinational conglomerate created in 2015 as the parent company of Google and several other companies previously owned by or tied to Google."
                    href="https://abc.xyz/" target="_blank"
                  />
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Extra content">
                  <c.Card header="Elliot" meta="Friend of Veronika"
                    description="Elliot requested permisson to view your contact details"
                    headerImage={<c.Image src={data.elliotAvatar} floated="right" size="mini"/>}
                  >
                    <c.Content appearance="extra">
                      <c.Buttons count={2}>
                        <c.Button appearance="basic" color="green">Approve</c.Button>
                        <c.Button appearance="basic" color="red">Decline</c.Button>
                      </c.Buttons>
                    </c.Content>
                  </c.Card>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Buttons">
                  <c.Card header="Kristy" meta="Joined in 2013"
                    description="Kristy is an art director living in New York."
                  >
                    <c.Button appearance="bottom attached" icon="plus" title="Add friend"/>
                  </c.Card>

                  <c.Card header="Elliot" meta="Joined in 2015"
                    description="Elliot is a software manager."
                  >
                    <c.Buttons appearance="bottom attached">
                      <c.Button icon="plus" title="Add friend"/>
                      <c.Button icon="email" title="Send Message"/>
                    </c.Buttons>
                  </c.Card>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Mulitple Content Regions">
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

          <c.PageSection title="Appearance">
            <c.Grid columns={2}>

              <c.Column>
                <c.Example title="Centered">
                  <c.Card appearance="centered" header="Elliot Fu"
                    image={data.elliotAvatar}
                  />
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Fluid">
                  <c.Card appearance="fluid" header="Elliot Fu"
                    image={data.elliotAvatar}
                  />
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Alignment">
                  <c.Card>
                    <c.Header align="center">Kristy York</c.Header>
                    <c.Content align="left">Liberal</c.Content>
                  </c.Card>
                  <c.Card>
                    <c.Header align="center">Joe Jones</c.Header>
                    <c.Content align="center">Independent</c.Content>
                  </c.Card>
                  <c.Card>
                    <c.Header align="center">Joe Jones</c.Header>
                    <c.Content align="right">Conservative</c.Content>
                  </c.Card>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Floated Content">
                  <c.Card>
                    <c.Content>
                      <c.Header>Kristy York</c.Header>
                      <c.Meta floated="right">24 Friends</c.Meta>
                    </c.Content>
                  </c.Card>
                </c.Example>
              </c.Column>
            </c.Grid>

            <c.Example title="Colors">
              <c.Cards columns={5}>
                <c.Card color="red" header="Red" image={data.whiteImage}/>
                <c.Card color="orange" header="Orange" image={data.whiteImage}/>
                <c.Card color="yellow" header="Yellow" image={data.whiteImage}/>
                <c.Card color="olive" header="Olive" image={data.whiteImage}/>
                <c.Card color="green" header="Green" image={data.whiteImage}/>
                <c.Card color="teal" header="Teal" image={data.whiteImage}/>
                <c.Card color="blue" header="Blue" image={data.whiteImage}/>
                <c.Card color="violet" header="Violet" image={data.whiteImage}/>
                <c.Card color="purple" header="Purple" image={data.whiteImage}/>
                <c.Card color="pink" header="Pink" image={data.whiteImage}/>
                <c.Card color="brown" header="Brown" image={data.whiteImage}/>
                <c.Card color="grey" header="Grey" image={data.whiteImage}/>
                <c.Card color="black" header="Black" image={data.whiteImage}/>
              </c.Cards>
            </c.Example>

          </c.PageSection>

        </c.Page>
      </c.CardContainer>
    );
  }
}

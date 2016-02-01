"use strict";
import React from "react";
import { Card } from "oak";

export default class RevealCard extends Card {
  static defaultProps = {
    id: "Reveal",
    title: "Reveal"
  }

  getInitialData() {
    return {
      image: "http://semantic-ui.com/images/wireframe/image.png",
      whiteImage: "http://semantic-ui.com/images/wireframe/white-image.png",
      squareImage: "http://semantic-ui.com/images/wireframe/square-image.png",

      joeAvatar: "http://semantic-ui.com/images/avatar/large/joe.jpg",
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
          <c.PageTitle title="Reveal">
            A reveal displays additional content in place of previous content when activated.
            <c.Todo>
              <li>Make this programmatic so we can activate dynamically.</li>
              <li>3-d Flip reveal for cards?</li>
            </c.Todo>
          </c.PageTitle>

          <c.PageSection title="Effects">

            <c.Example title="Fade" hint="<Reveal effect='fade'/>">
              <c.Reveal>
                <c.Image src={data.squareImage} size="small"/>
                <c.Image src={data.joeAvatar} size="small"/>
              </c.Reveal>

              <c.Spacer inline/>

              <c.Reveal appearance="small image">
                <img className="visible content" src={data.squareImage}/>
                <img className="hidden content" src={data.joeAvatar}/>
              </c.Reveal>
            </c.Example>

            <c.Example title="Move" hint="<Reveal effect='move right'/>">
              <c.Reveal appearance="small image" effect="move">
                <c.Image src={data.squareImage} size="small"/>
                <c.Image src={data.joeAvatar} size="small"/>
              </c.Reveal>

              <c.Spacer inline/>
              <c.Reveal appearance="small image" effect="move right">
                <c.Image src={data.squareImage} size="small"/>
                <c.Image src={data.joeAvatar} size="small"/>
              </c.Reveal>

              <c.Spacer inline/>
              <c.Reveal appearance="circular small image" effect="move up">
                <img className="visible content" src={data.squareImage}/>
                <img className="hidden content" src={data.joeAvatar}/>
              </c.Reveal>

              <c.Spacer inline/>
              <c.Reveal appearance="circular small image" effect="move down">
                <img className="visible content" src={data.squareImage}/>
                <img className="visible content" src={data.joeAvatar}/>
              </c.Reveal>

            </c.Example>

            <c.Example title="Rotate" hint="<Reveal effect='rotate left'/>">
              <c.Reveal appearance="small image" effect="rotate left">
                <c.Image src={data.squareImage} size="small"/>
                <c.Image src={data.joeAvatar} size="small"/>
              </c.Reveal>

              <c.Spacer inline/>
              <c.Reveal appearance="small image" effect="rotate">
                <c.Image src={data.squareImage} size="small"/>
                <c.Image src={data.joeAvatar} size="small"/>
              </c.Reveal>

              <c.Spacer inline/>
              <c.Reveal appearance="circular small image" effect="rotate left">
                <img className="visible content" src={data.squareImage}/>
                <img className="hidden content" src={data.joeAvatar}/>
              </c.Reveal>

              <c.Spacer inline/>
              <c.Reveal appearance="circular small image" effect="rotate">
                <img className="visible content" src={data.squareImage}/>
                <img className="visible content" src={data.joeAvatar}/>
              </c.Reveal>
            </c.Example>

          </c.PageSection>

          <c.PageSection title="States">
            <c.Grid columns={2}>
              <c.Column>
                <c.Example title="Active" hint="<Reveal active/>">
                  <c.Reveal appearance="small image" active>
                    <img src={data.squareImage}/>
                    <img src={data.joeAvatar}/>
                  </c.Reveal>
                  <c.Info><b>active</b> reveals always show their content</c.Info>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Disabled" hint="<Reveal disabled/>">
                  <c.Reveal appearance="small image" disabled>
                    <img src={data.squareImage}/>
                    <img src={data.joeAvatar}/>
                  </c.Reveal>
                  <c.Info><b>disabled</b> reveals don't have a visual effect when hovered.</c.Info>
                </c.Example>
              </c.Column>
            </c.Grid>

          </c.PageSection>

          <c.PageSection title="Speeds">
            <c.Grid columns={2}>
              <c.Column>
                <c.Example title="Instant" hint="<Reveal effect='instant fade'/>">
                  <c.Reveal effect='instant fade' appearance="small image">
                    <img src={data.squareImage}/>
                    <img src={data.joeAvatar}/>
                  </c.Reveal>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Normal (for contrast)">
                  <c.Reveal effect='fade' appearance="small image">
                    <img src={data.squareImage}/>
                    <img src={data.joeAvatar}/>
                  </c.Reveal>
                </c.Example>
              </c.Column>
            </c.Grid>
            <c.Bug>There doesn't appear to be a significant difference in an instant reveal</c.Bug>

          </c.PageSection>
        </c.Page>
      </c.CardContainer>
    );
  }
}

"use strict";
import React from "react";
import { Card } from "oak";

export default class ShapeCard extends Card {
  static defaultProps = {
    id: "Shape",
    title: "Shape"
  }

  getInitialData() {
    return {
      image: "http://semantic-ui.com/images/wireframe/image.png",
      whiteImage: "http://semantic-ui.com/images/wireframe/white-image.png",
      squareImage: "http://semantic-ui.com/images/wireframe/square-image.png",

      joeAvatar: "http://semantic-ui.com/images/avatar/large/joe.jpg",
      elliotAvatar: "http://semantic-ui.com/images/avatar/large/elliot.jpg",
      stevieAvatar: "http://semantic-ui.com/images/avatar/large/stevie.jpg",
      mattAvatar: "http://semantic-ui.com/images/avatar/large/matt.jpg",
      jennyAvatar: "http://semantic-ui.com/images/avatar/large/jenny.jpg",
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
          <c.PageTitle title="Shape">
            A shape is a three dimensional object displayed on a two dimensional plane
            <c.Info>
              The module uses 3D transformations which are currently only supported in modern versions of Chrome, Safari, and Firefox.
            </c.Info>
          </c.PageTitle>

          <c.PageSection title="Content">
            <c.Grid columns={2}>
              <c.Column>
                <c.Example title="Normal HTML markup for children">
                  <c.Shape ref="htmlMarkup">
                    <div className="sides">
                      <div className="joe active side">
                        <c.Image src={data.joeAvatar} appearance="medium"/>
                      </div>
                      <div className="stevie side">
                        <c.Image src={data.stevieAvatar} appearance="medium"/>
                      </div>
                      <div className="elliot side">
                        <c.Image src={data.elliotAvatar} appearance="medium"/>
                      </div>
                    </div>
                  </c.Shape>
                  <c.Flippers for="htmlMarkup"/>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Side markup for children">
                  <c.Shape ref="sideMarkup">
                    <c.Side className="joe">
                      <c.Image src={data.joeAvatar} appearance="medium"/>
                    </c.Side>

                    <c.Side className="stevie" active>
                      <c.Image src={data.stevieAvatar} appearance="medium"/>
                    </c.Side>

                    <c.Side className="elliot">
                      <c.Image src={data.elliotAvatar} appearance="medium"/>
                    </c.Side>
                  </c.Shape>
                  <c.Flippers for="sideMarkup"/>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Children auto-wrapped with Sides">
                  <c.Shape ref="autoWrapped" active={3}>
                    <c.Image src={data.joeAvatar} appearance="medium"/>
                    <c.Image src={data.stevieAvatar} appearance="medium"/>
                    <c.Image src={data.elliotAvatar} appearance="medium"/>
                  </c.Shape>
                  <c.Flippers for="autoWrapped"/>
                </c.Example>
              </c.Column>
            </c.Grid>
          </c.PageSection>


          <c.PageSection title="Appearance">
            <c.Grid columns={2}>
              <c.Column>
                <c.Example title="Cube" hint="<Shape appearance='cube'/>">
                  <c.Shape ref="cube" appearance="cube" direction='down' onClick={()=> card.refs.cube.flip()}>
                    <c.Image src={data.joeAvatar} appearance="medium"/>
                    <c.Image src={data.stevieAvatar} appearance="medium"/>
                    <c.Image src={data.elliotAvatar} appearance="medium"/>
                    <c.Image src={data.jennyAvatar} appearance="medium"/>
                    <c.Image src={data.mattAvatar} appearance="medium"/>
                    <c.Image src={data.squareImage} appearance="medium"/>
                  </c.Shape>
                  <c.Flippers for="cube"/>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Unpadded Cube" hint="<Shape appearance='unpadded cube'/>">
                  <c.Shape ref="unpadded" appearance="unpadded cube" active={3} direction='down' onClick={()=> card.refs.unpadded.flip()}>
                    <c.Image src={data.joeAvatar} appearance="medium"/>
                    <c.Image src={data.stevieAvatar} appearance="medium"/>
                    <c.Image src={data.elliotAvatar} appearance="medium"/>
                    <c.Image src={data.jennyAvatar} appearance="medium"/>
                    <c.Image src={data.mattAvatar} appearance="medium"/>
                    <c.Image src={data.squareImage} appearance="medium"/>
                  </c.Shape>
                  <c.Flippers for="unpadded"/>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Text">
                  <c.Shape ref="text" appearance="text" direction='down' onClick={()=> card.refs.text.flip()}>
                    <div style={{width: 200, height:30, background:"lightgrey"}}>Side 1</div>
                    <div style={{width: 200, height:30, background:"pink"}}>Side 2</div>
                    <div style={{width: 200, height:30, background:"lightblue"}}>Side 3</div>
                    <div style={{width: 200, height:30, background:"lightgreen"}}>Side 4</div>
                  </c.Shape>
                  <c.Flippers for="text"/>
                </c.Example>

                <c.Info>
                  A text shape must have defined width and heights for each side or else text flow may change during animation.
                </c.Info>
              </c.Column>

              <c.Column>
                <c.Example title="Irregular content sizes">
                  <c.Shape ref="irregular" onClick={()=> card.refs.irregular.flip()}>
                    <c.Image src={data.image} appearance="medium"/>
                    <c.Image src={data.joeAvatar} appearance="medium"/>
                    <c.Card image={data.stevieAvatar} header="Stevie"/>
                  </c.Shape>
                  <c.Flippers for="irregular"/>
                </c.Example>
              </c.Column>

            </c.Grid>
          </c.PageSection>

        </c.Page>
      </c.CardContainer>
    );
  }
}

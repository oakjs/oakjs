"use strict";
import React from "react";
import { Card } from "oak";

export default class ImagesCard extends Card {
  static defaultProps = {
    id: "Images",
    title: "Images"
  }

  getInitialData() {
    return {
      image: "http://semantic-ui.com/images/wireframe/image.png",
      whiteImage: "http://semantic-ui.com/images/wireframe/white-image.png",
      squareImage: "http://semantic-ui.com/images/wireframe/square-image.png",
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
          <c.PageTitle title="Images">
            Imagess add consistent styling to a nested list of Images.
          </c.PageTitle>

          <c.PageSection title="Sizes">

            <c.Message>
              Sizing is the same as for <c.Link card="SUI/examples/images">Images</c.Link> and
              applies to all the nested images.
            </c.Message>

            <c.Example title="mini, tiny, small, etc">
              <c.Images size="mini">
                <c.Image src={data.image}/>
                <c.Image src={data.image}/>
                <c.Image src={data.image}/>
              </c.Images>

              <c.Spacer/>
              <c.Images size="tiny">
                <c.Image src={data.image}/>
                <c.Image src={data.image}/>
                <c.Image src={data.image}/>
              </c.Images>

              <c.Spacer/>
              <c.Images size="small">
                <c.Image src={data.image}/>
                <c.Image src={data.image}/>
                <c.Image src={data.image}/>
              </c.Images>
            </c.Example>

          </c.PageSection>

          <c.PageSection grid title="Appearance">

            <c.Message>
              Appearance is the same as for <c.Link card="SUI/examples/images">Images</c.Link> and
              applies to all the nested images.
            </c.Message>

            <c.Example title="avatar" columns={8}>
              <c.Images size="mini" appearance="avatar">
                <c.Image src={data.squareImage}/>
                <c.Image src={data.squareImage}/>
                <c.Image src={data.squareImage}/>
              </c.Images>
            </c.Example>

            <c.Example title="circular" columns={8}>
              <c.Images size="tiny" appearance="circular">
                <c.Image src={data.squareImage}/>
                <c.Image src={data.squareImage}/>
                <c.Image src={data.squareImage}/>
              </c.Images>
            </c.Example>

            <c.Example title="rounded" columns={8}>
              <c.Images size="tiny" appearance="rounded">
                <c.Image src={data.image}/>
                <c.Image src={data.image}/>
                <c.Image src={data.image}/>
              </c.Images>
            </c.Example>

            <c.Example title="bordered" columns={8}>
              <c.Images size="tiny" appearance="bordered">
                <c.Image src={data.whiteImage}/>
                <c.Image src={data.whiteImage}/>
                <c.Image src={data.whiteImage}/>
              </c.Images>
            </c.Example>

            <c.Example title="centered" hint="<Image spaced/> or <Image spaced='left'/>" columns={8}>
              <c.Images size="tiny" appearance="centered">
                <c.Image src={data.image}/>
                <c.Image src={data.image}/>
                <c.Image src={data.image}/>
              </c.Images>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
              Aenean massa strong. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur
              ridiculus mus.
            </c.Example>

            <c.Example title="floated" hint="<Images floated='left'/>" columns={8}>
              <p>
                <c.Images floated="left" size="mini" tagName="span">
                  <c.Image src={data.image}/>
                  <c.Image src={data.image}/>
                  <c.Image src={data.image}/>
                </c.Images>
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
                Aenean massa strong. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur
                ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla
                consequat massa quis enim.
              </p><p>
                <c.Images floated="right" size="mini" tagName="span">
                  <c.Image src={data.image}/>
                  <c.Image src={data.image}/>
                  <c.Image src={data.image}/>
                </c.Images>
                Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu.
                In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede
                link mollis pretium. Integer tincidunt.
              </p>
            </c.Example>

          </c.PageSection>

        </c.Page>
      </c.CardContainer>
    );
  }
}

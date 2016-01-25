"use strict";
import React from "react";
import { Card } from "oak";

export default class ImageGroupCard extends Card {
  static defaultProps = {
    id: "ImageGroup",
    title: "ImageGroup"
  }
  render() {
    const c = this.components;
    return (
      <div {...this.renderProps}>
        <c.PageSidebar/>
        <c.Page>
          <c.PageTitle title="ImageGroup">
            ImageGroups add consistent styling to a nested list of Images.
          </c.PageTitle>

          <c.PageSection title="Sizes">

            <c.Message>
              Sizing is the same as for <c.Link card="SUI/examples/images">Images</c.Link> and
              applies to all the nested images.
            </c.Message>

            <c.Example title="mini, tiny, small, etc">
              <c.ImageGroup size="mini">
                <c.Image src="http://semantic-ui.com/images/wireframe/image.png"/>
                <c.Image src="http://semantic-ui.com/images/wireframe/image.png"/>
                <c.Image src="http://semantic-ui.com/images/wireframe/image.png"/>
              </c.ImageGroup>

              <c.ImageGroup size="tiny">
                <c.Image src="http://semantic-ui.com/images/wireframe/image.png"/>
                <c.Image src="http://semantic-ui.com/images/wireframe/image.png"/>
                <c.Image src="http://semantic-ui.com/images/wireframe/image.png"/>
              </c.ImageGroup>

              <c.ImageGroup size="small">
                <c.Image src="http://semantic-ui.com/images/wireframe/image.png"/>
                <c.Image src="http://semantic-ui.com/images/wireframe/image.png"/>
                <c.Image src="http://semantic-ui.com/images/wireframe/image.png"/>
              </c.ImageGroup>
            </c.Example>

          </c.PageSection>

          <c.PageSection grid title="Appearance">

            <c.Message columns={16}>
              Appearance is the same as for <c.Link card="SUI/examples/images">Images</c.Link> and
              applies to all the nested images.
            </c.Message>

            <c.Example title="avatar" columns={8}>
              <c.ImageGroup size="mini" appearance="avatar">
                <c.Image src="http://semantic-ui.com/images/wireframe/image-square.png"/>
                <c.Image src="http://semantic-ui.com/images/wireframe/image-square.png"/>
                <c.Image src="http://semantic-ui.com/images/wireframe/image-square.png"/>
              </c.ImageGroup>
            </c.Example>

            <c.Example title="circular" columns={8}>
              <c.ImageGroup size="tiny" appearance="circular">
                <c.Image src="http://semantic-ui.com/images/wireframe/image-square.png"/>
                <c.Image src="http://semantic-ui.com/images/wireframe/image-square.png"/>
                <c.Image src="http://semantic-ui.com/images/wireframe/image-square.png"/>
              </c.ImageGroup>
            </c.Example>

            <c.Example title="rounded" columns={8}>
              <c.ImageGroup size="tiny" appearance="rounded">
                <c.Image src="http://semantic-ui.com/images/wireframe/image.png"/>
                <c.Image src="http://semantic-ui.com/images/wireframe/image.png"/>
                <c.Image src="http://semantic-ui.com/images/wireframe/image.png"/>
              </c.ImageGroup>
            </c.Example>

            <c.Example title="bordered" columns={8}>
              <c.ImageGroup size="tiny" appearance="bordered">
                <c.Image src="http://semantic-ui.com/images/wireframe/white-image.png"/>
                <c.Image src="http://semantic-ui.com/images/wireframe/white-image.png"/>
                <c.Image src="http://semantic-ui.com/images/wireframe/white-image.png"/>
              </c.ImageGroup>
            </c.Example>

            <c.Example title="centered" hint="<Image spaced/> or <Image spaced='left'/>" columns={8}>
              <c.ImageGroup size="tiny" appearance="centered">
                <c.Image src="http://semantic-ui.com/images/wireframe/image.png"/>
                <c.Image src="http://semantic-ui.com/images/wireframe/image.png"/>
                <c.Image src="http://semantic-ui.com/images/wireframe/image.png"/>
              </c.ImageGroup>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
              Aenean massa strong. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur
              ridiculus mus.
            </c.Example>

            <c.Example title="float" hint="<ImageGroup float='left'/>" columns={8}>
              <p>
                <c.ImageGroup float="left" size="mini">
                  <c.Image src="http://semantic-ui.com/images/wireframe/image.png"/>
                  <c.Image src="http://semantic-ui.com/images/wireframe/image.png"/>
                  <c.Image src="http://semantic-ui.com/images/wireframe/image.png"/>
                </c.ImageGroup>
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
                Aenean massa strong. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur
                ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla
                consequat massa quis enim.
              </p><p>
                <c.ImageGroup float="right" size="mini">
                  <c.Image src="http://semantic-ui.com/images/wireframe/image.png"/>
                  <c.Image src="http://semantic-ui.com/images/wireframe/image.png"/>
                  <c.Image src="http://semantic-ui.com/images/wireframe/image.png"/>
                </c.ImageGroup>
                Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu.
                In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede
                link mollis pretium. Integer tincidunt.
              </p>
            </c.Example>

          </c.PageSection>

        </c.Page>
      </div>
    );
  }
}

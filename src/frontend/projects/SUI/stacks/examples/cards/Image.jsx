"use strict";
import React from "react";
import { Card } from "oak";

export default class ImageCard extends Card {
  static defaultProps = {
    id: "Image",
    title: "Image"
  }
  render() {
    const c = this.components;
    return (
      <div {...this.renderProps}>
        <c.PageSidebar/>
        <c.Page>
          <c.PageTitle title="Image">
            An image is a graphical representation of something.
          </c.PageTitle>

          <c.PageSection title="Sizes">

            <c.Message>
              Unless a size is specified, images will use the original dimensions
              of the image up to the size of their container.
            </c.Message>

            <table className="ui compact celled striped definition table">
              <thead>
                <tr>
                  <th className="one wide">Size</th>
                  <th className="one wide">Width</th>
                  <th>Sample</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Mini</td><td>35px</td><td><c.Cropper height={50}><c.Image size="mini" src="http://semantic-ui.com/images/wireframe/image.png"/></c.Cropper></td></tr>
                <tr><td>Tiny</td><td>80px</td><td><c.Cropper height={50}><c.Image size="tiny" src="http://semantic-ui.com/images/wireframe/image.png"/></c.Cropper></td></tr>
                <tr><td>Small</td><td>150px</td><td><c.Cropper height={50}><c.Image size="small" src="http://semantic-ui.com/images/wireframe/image.png"/></c.Cropper></td></tr>
                <tr><td>Medium</td><td>300px</td><td><c.Cropper height={50}><c.Image size="medium" src="http://semantic-ui.com/images/wireframe/image.png"/></c.Cropper></td></tr>
                <tr><td>Large</td><td>450px</td><td><c.Cropper height={50}><c.Image size="large" src="http://semantic-ui.com/images/wireframe/image.png"/></c.Cropper></td></tr>
                <tr><td>Big</td><td>600px</td><td><c.Cropper height={50}><c.Image size="big" src="http://semantic-ui.com/images/wireframe/image.png"/></c.Cropper></td></tr>
                <tr><td>Huge</td><td>800px</td><td><c.Cropper height={50}><c.Image size="huge" src="http://semantic-ui.com/images/wireframe/image.png"/></c.Cropper></td></tr>
                <tr><td>Massive</td><td>970px</td><td><c.Cropper height={50}><c.Image size="massive" src="http://semantic-ui.com/images/wireframe/image.png"/></c.Cropper></td></tr>
              </tbody>
            </table>

            <c.Example title="fluid" hint="<Image appearance='fluid'/>">
              <c.Cropper height={100}>
                <c.Image appearance="fluid" src="http://semantic-ui.com/images/wireframe/image.png"/>
              </c.Cropper>
            </c.Example>

          </c.PageSection>


          <c.PageSection grid title="Appearance">
            <c.Example title="avatar" hint="<Image appearance='avatar'/>" columns={4}>
              <c.Image appearance="avatar" src="http://semantic-ui.com/images/wireframe/square-image.png"/>
              Joe Bob User
            </c.Example>

            <c.Example title="circular" hint="<Image appearance='circular'/>" columns={4}>
              <c.Image appearance="circular" size="small" src="http://semantic-ui.com/images/wireframe/square-image.png"/>
            </c.Example>

            <c.Example title="rounded" hint="<Image appearance='rounded'/>" columns={4}>
              <c.Image appearance="rounded" size="small" src="http://semantic-ui.com/images/wireframe/image.png"/>
            </c.Example>

            <c.Example title="bordered" hint="<Image appearance='bordered'/>" columns={4}>
              <c.Image appearance="bordered" size="small" src="http://semantic-ui.com/images/wireframe/white-image.png"/>
            </c.Example>

            <c.Example title="spaced" hint="<Image spaced/> or <Image spaced='left'/>" columns={8}>
              <c.Image spaced="right" size="mini" src="http://semantic-ui.com/images/wireframe/image.png"/>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
              Aenean massa strong. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur
              ridiculus mus. <c.Image spaced size="mini" src="http://semantic-ui.com/images/wireframe/image.png"/>
              Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla
              consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu.
              In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede
              link mollis pretium. Integer tincidunt. <c.Image spaced="left" size="mini" src="http://semantic-ui.com/images/wireframe/image.png"/>
            </c.Example>

            <c.Example title="floated" hint="<Image spaced/> or <Image spaced='left'/>" columns={8}>
              <p>
                <c.Image float="left" size="tiny" src="http://semantic-ui.com/images/wireframe/image.png"/>
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
                Aenean massa strong. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur
                ridiculus mus.
              </p><p>
                <c.Image float="right" spaced appearance="bordered" size="tiny" src="http://semantic-ui.com/images/wireframe/white-image.png"/>
                Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla
                consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu.
                In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede
                link mollis pretium. Integer tincidunt.
              </p>
            </c.Example>

            <c.Example title="centered" hint="<Image spaced/> or <Image spaced='left'/>" columns={8}>
              <c.Image appearance="centered" size="small" src="http://semantic-ui.com/images/wireframe/image.png"/>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
              Aenean massa strong. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur
              ridiculus mus.
            </c.Example>


            <c.Example title="Vertical Alignment" hint="<Image valign='middle'/>" columns={8}>
              <c.Image spaced="right" valign='top' size="small" src="http://semantic-ui.com/images/wireframe/image.png"/><span>Text</span>
              <c.Divider/>
              <c.Image spaced="right" valign='middle' size="small" src="http://semantic-ui.com/images/wireframe/image.png"/>Text
              <c.Divider/>
              <c.Image spaced="right" valign='bottom' size="small" src="http://semantic-ui.com/images/wireframe/image.png"/>Text
            </c.Example>

          </c.PageSection>

          <c.PageSection title="States">
            <c.Grid>
              <c.Example title="hidden" hint="<Image hidden/>" columns={8}>
                <c.Image hidden size="small" src="http://semantic-ui.com/images/wireframe/image.png"/>
              </c.Example>

              <c.Example title="disabled" hint="<Image disabled/>" columns={8}>
                <c.Image disabled size="small" src="http://semantic-ui.com/images/wireframe/image.png"/>
              </c.Example>

            </c.Grid>
          </c.PageSection>

        </c.Page>
      </div>
    );
  }
}

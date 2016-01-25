"use strict";
import React from "react";
import { Card } from "oak";

export default class ImageLinkCard extends Card {
  static defaultProps = {
    id: "ImageLink",
    title: "ImageLink"
  }
  render() {
    const c = this.components;
    return (
      <div {...this.renderProps}>
        <c.PageSidebar/>
        <c.Page>
          <c.PageTitle title="ImageLink">
            <p>ImageLinks are images which link to some arbitrary web page.
              <br/>
              They have the same visual semantics as <c.Link card="SUI/examples/Image">Images</c.Link>.
            </p>
            <p>You can specify <b>href</b> and <b>target</b> properties for your linking pleasure.</p>
          </c.PageTitle>

          <c.PageSection grid title="Appearance">
              <c.Example title="avatar" hint="<ImageLink appearance='avatar'/>" columns={4}>
                <c.ImageLink href="http://google.com" target="_blank" appearance="avatar" src="http://semantic-ui.com/images/wireframe/square-image.png"/>
                Joe Bob User
              </c.Example>

              <c.Example title="circular" hint="<ImageLink appearance='circular'/>" columns={4}>
                <c.ImageLink href="http://google.com" target="_blank" appearance="circular" size="small" src="http://semantic-ui.com/images/wireframe/square-image.png"/>
              </c.Example>

              <c.Example title="rounded" hint="<ImageLink appearance='rounded'/>" columns={4}>
                <c.ImageLink href="http://google.com" target="_blank" appearance="rounded" size="small" src="http://semantic-ui.com/images/wireframe/image.png"/>
              </c.Example>

              <c.Example title="bordered" hint="<ImageLink appearance='bordered'/>" columns={4}>
                <c.ImageLink href="http://google.com" target="_blank" appearance="bordered" size="small" src="http://semantic-ui.com/images/wireframe/white-image.png"/>
              </c.Example>

              <c.Example title="spaced" hint="<ImageLink spaced/> or <ImageLink spaced='left'/>" columns={8}>
                <c.ImageLink href="http://google.com" target="_blank" spaced="right" size="mini" src="http://semantic-ui.com/images/wireframe/image.png"/>
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
                Aenean massa strong. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur
                ridiculus mus. <c.ImageLink href="http://google.com" target="_blank" spaced size="mini" src="http://semantic-ui.com/images/wireframe/image.png"/>
                Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla
                consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu.
                In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede
                link mollis pretium. Integer tincidunt. <c.ImageLink href="http://google.com" target="_blank" spaced="left" size="mini" src="http://semantic-ui.com/images/wireframe/image.png"/>
              </c.Example>

              <c.Example title="floated" hint="<ImageLink spaced/> or <ImageLink spaced='left'/>" columns={8}>
                <p>
                  <c.ImageLink href="http://google.com" target="_blank" float="left" size="tiny" src="http://semantic-ui.com/images/wireframe/image.png"/>
                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
                  Aenean massa strong. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur
                  ridiculus mus.
                </p><p>
                  <c.ImageLink href="http://google.com" target="_blank" float="right" spaced appearance="bordered" size="tiny" src="http://semantic-ui.com/images/wireframe/white-image.png"/>
                  Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla
                  consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu.
                  In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede
                  link mollis pretium. Integer tincidunt.
                </p>
              </c.Example>

            <c.Example title="centered" hint="<ImageLink spaced/> or <ImageLink spaced='left'/>" columns={8}>
              <c.ImageLink href="http://google.com" target="_blank" appearance="centered" size="small" src="http://semantic-ui.com/images/wireframe/image.png"/>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
              Aenean massa strong. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur
              ridiculus mus.
            </c.Example>


            <c.Example title="Vertical Alignment" hint="<ImageLink valign='middle'/>" columns={8}>
              <c.ImageLink href="http://google.com" target="_blank" spaced valign='top' size="small" src="http://semantic-ui.com/images/wireframe/image.png"/><span>Text</span>
              <c.Divider/>
              <c.ImageLink href="http://google.com" target="_blank" spaced valign='middle' size="small" src="http://semantic-ui.com/images/wireframe/image.png"/>Text
              <c.Divider/>
              <c.ImageLink href="http://google.com" target="_blank" spaced valign='bottom' size="small" src="http://semantic-ui.com/images/wireframe/image.png"/>Text
            </c.Example>

          </c.PageSection>

          <c.PageSection title="States">
            <c.Grid>
              <c.Example title="hidden" hint="<ImageLink hidden/>" columns={8}>
                <c.ImageLink href="http://google.com" target="_blank" hidden size="small" src="http://semantic-ui.com/images/wireframe/image.png"/>
              </c.Example>

              <c.Example title="disabled" hint="<ImageLink disabled/>  NOTE: disabled ImageLinks are not clickable!" columns={8}>
                <c.ImageLink href="http://google.com" target="_blank" disabled size="small" src="http://semantic-ui.com/images/wireframe/image.png"/>
              </c.Example>
            </c.Grid>
          </c.PageSection>


        </c.Page>
      </div>
    );
  }
}

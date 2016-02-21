"use strict";
import React from "react";
import Card from "oak/Card";

export default class ImageCard extends Card {
  static defaultProps = {
    id: "Image",
    title: "Image"
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
          <c.PageTitle title="Image">
            An image is a graphical representation of something.
          </c.PageTitle>

          <c.PageSection title="Types">

            <c.Example title="Images without children (normal <img> elements)">
              <c.Image src={data.image} size='small' inline/>
              <c.Spacer inline/>
              <c.Image src={data.image} size='small' inline/>
            </c.Example>

            <c.Example title="Images with children">
              <c.Image src={data.image} size='small' inline>
                <c.Label appearance="fluid">Labeled image</c.Label>
              </c.Image>
              <c.Spacer inline/>
              <c.Image src={data.image} size='small' inline>
                <c.Label appearance="right corner" icon="mail"/>
              </c.Image>
            </c.Example>

          </c.PageSection>


          <c.PageSection title="Sizes">

            <c.Info>
              Unless a size is specified, images will use the original dimensions
              of the image up to the size of their container.
            </c.Info>

            <table className="ui compact celled striped definition table">
              <thead>
                <tr>
                  <th className="one wide">Size</th>
                  <th className="one wide">Width</th>
                  <th>Sample</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Mini</td><td>35px</td><td><c.Cropper height={50}><c.Image size="mini" src={data.image}/></c.Cropper></td></tr>
                <tr><td>Tiny</td><td>80px</td><td><c.Cropper height={50}><c.Image size="tiny" src={data.image}/></c.Cropper></td></tr>
                <tr><td>Small</td><td>150px</td><td><c.Cropper height={50}><c.Image size="small" src={data.image}/></c.Cropper></td></tr>
                <tr><td>Medium</td><td>300px</td><td><c.Cropper height={50}><c.Image size="medium" src={data.image}/></c.Cropper></td></tr>
                <tr><td>Large</td><td>450px</td><td><c.Cropper height={50}><c.Image size="large" src={data.image}/></c.Cropper></td></tr>
                <tr><td>Big</td><td>600px</td><td><c.Cropper height={50}><c.Image size="big" src={data.image}/></c.Cropper></td></tr>
                <tr><td>Huge</td><td>800px</td><td><c.Cropper height={50}><c.Image size="huge" src={data.image}/></c.Cropper></td></tr>
                <tr><td>Massive</td><td>970px</td><td><c.Cropper height={50}><c.Image size="massive" src={data.image}/></c.Cropper></td></tr>
              </tbody>
            </table>

            <c.Example title="fluid" hint="<Image appearance='fluid'/>">
              <c.Cropper height={100}>
                <c.Image appearance="fluid" src={data.image}/>
              </c.Cropper>
            </c.Example>

          </c.PageSection>


          <c.PageSection grid title="Appearance">
            <c.Example title="avatar" hint="<Image appearance='avatar'/>" columns={4}>
              <c.Image appearance="avatar" src={data.squareImage}/>
              Joe Bob User
            </c.Example>

            <c.Example title="circular" hint="<Image appearance='circular'/>" columns={4}>
              <c.Image appearance="circular" size="small" src={data.squareImage}/>
            </c.Example>

            <c.Example title="rounded" hint="<Image appearance='rounded'/>" columns={4}>
              <c.Image appearance="rounded" size="small" src={data.image}/>
            </c.Example>

            <c.Example title="bordered" hint="<Image appearance='bordered'/>" columns={4}>
              <c.Image appearance="bordered" size="small" src={data.whiteImage}/>
            </c.Example>

            <c.Example title="spaced" hint="<Image spaced/> or <Image spaced='left'/>" columns={8}>
              <c.Image spaced="right" size="mini" src={data.image}/>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
              Aenean massa strong. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur
              ridiculus mus. <c.Image spaced size="mini" src={data.image}/>
              Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla
              consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu.
              In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede
              link mollis pretium. Integer tincidunt. <c.Image spaced="left" size="mini" src={data.image}/>
            </c.Example>

            <c.Example title="floated" hint="<Image spaced/> or <Image spaced='left'/>" columns={8}>
              <p>
                <c.Image floated="left" size="tiny" src={data.image}/>
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
                Aenean massa strong. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur
                ridiculus mus.
              </p><p>
                <c.Image floated="right" spaced appearance="bordered" size="tiny" src={data.whiteImage}/>
                Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla
                consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu.
                In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede
                link mollis pretium. Integer tincidunt.
              </p>
            </c.Example>

            <c.Example title="centered" hint="<Image spaced/> or <Image spaced='left'/>" columns={8}>
              <c.Image appearance="centered" size="small" src={data.image}/>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
              Aenean massa strong. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur
              ridiculus mus.
            </c.Example>


            <c.Example title="Vertical Alignment" hint="<Image align='middle'/>" columns={8}>
              <c.Image spaced="right" align='top' size="small" src={data.image}/><span>Text</span>
              <c.Divider/>
              <c.Image spaced="right" align='middle' size="small" src={data.image}/>Text
              <c.Divider/>
              <c.Image spaced="right" align='bottom' size="small" src={data.image}/>Text
            </c.Example>

          </c.PageSection>

          <c.PageSection title="States">
            <c.Grid>
              <c.Example title="hidden" hint="<Image hidden/>" columns={8}>
                <c.Image hidden size="small" src={data.image}/>
              </c.Example>

              <c.Example title="disabled" hint="<Image disabled/>" columns={8}>
                <c.Image disabled size="small" src={data.image}/>
              </c.Example>

            </c.Grid>
          </c.PageSection>

        </c.Page>
      </c.CardContainer>
    );
  }
}

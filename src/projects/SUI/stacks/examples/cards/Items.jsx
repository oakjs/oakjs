"use strict";
import React from "react";
import Card from "oak/Card";

export default class ItemsCard extends Card {
  static defaultProps = {
    id: "Items",
    title: "Items"
  }

  getInitialData() {
    return {
      image: "http://semantic-ui.com/images/wireframe/image.png",
      whiteImage: "http://semantic-ui.com/images/wireframe/white-image.png",

      joeAvatar: "http://semantic-ui.com/images/avatar/large/joe.jpg",
      kristyAvatar: "http://semantic-ui.com/images/avatar2/large/kristy.png",
      elliotAvatar: "http://semantic-ui.com/images/avatar/large/elliot.jpg",
      stevieAvatar: "http://semantic-ui.com/images/avatar/large/stevie.jpg",
      jennyAvatar: "http://semantic-ui.com/images/avatar/large/jenny.jpg",
      steveAvatar: "http://semantic-ui.com/images/avatar/large/steve.jpg",
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
          <c.PageTitle title="Items">
            A group of items.
          </c.PageTitle>

          <c.PageSection title="Appearance">

            <c.Example title="Items" hint="<Items/>">
              <c.Items>
                <c.Item header="Joe Constance" content="Joe is a kung fu instructor living in New York" image={data.joeAvatar} imageAppearance='tiny'/>
                <c.Item header="Kristy Bainbridge" content="Kristy is a graphic designer living in New York" image={data.kristyAvatar} imageAppearance='tiny'/>
                <c.Item header="Elliot Fu" content="Elliot is a software manager living in New York" image={data.elliotAvatar} imageAppearance='tiny'/>
              </c.Items>
            </c.Example>


            <c.Example title="Divided" hint="<Items divided/>">
              <c.Items divided>
                <c.Item header="Joe Constance" content="Joe is a kung fu instructor living in New York" image={data.joeAvatar} imageAppearance='tiny'/>
                <c.Item header="Kristy Bainbridge" content="Kristy is a graphic designer living in New York" image={data.kristyAvatar} imageAppearance='tiny'/>
                <c.Item header="Elliot Fu" content="Elliot is a software manager living in New York" image={data.elliotAvatar} imageAppearance='tiny'/>
              </c.Items>
            </c.Example>


            <c.Example title="Link" hint="<Items appearance='link'/>">
              <c.Items appearance="link">
                <c.Item header="Joe Constance" content="Joe is a kung fu instructor living in New York" image={data.joeAvatar} imageAppearance='tiny'/>
                <c.Item header="Kristy Bainbridge" content="Kristy is a graphic designer living in New York" image={data.kristyAvatar} imageAppearance='tiny'/>
                <c.Item header="Elliot Fu" content="Elliot is a software manager living in New York" image={data.elliotAvatar} imageAppearance='tiny'/>
              </c.Items>
            </c.Example>


            <c.Example title="Relaxed" hint="<Items appearance='relaxed'/>">
              <c.Items appearance="relaxed">
                <c.Item header="Joe Constance" content="Joe is a kung fu instructor living in New York" image={data.joeAvatar} imageAppearance='tiny'/>
                <c.Item header="Kristy Bainbridge" content="Kristy is a graphic designer living in New York" image={data.kristyAvatar} imageAppearance='tiny'/>
                <c.Item header="Elliot Fu" content="Elliot is a software manager living in New York" image={data.elliotAvatar} imageAppearance='tiny'/>
              </c.Items>
            </c.Example>

            <c.Example title="Relaxed" hint="<Items appearance='very relaxed'/>">
              <c.Items appearance="very relaxed">
                <c.Item header="Joe Constance" content="Joe is a kung fu instructor living in New York" image={data.joeAvatar} imageAppearance='tiny'/>
                <c.Item header="Kristy Bainbridge" content="Kristy is a graphic designer living in New York" image={data.kristyAvatar} imageAppearance='tiny'/>
                <c.Item header="Elliot Fu" content="Elliot is a software manager living in New York" image={data.elliotAvatar} imageAppearance='tiny'/>
              </c.Items>
            </c.Example>

          </c.PageSection>

        </c.Page>
      </c.CardContainer>
    );
  }
}

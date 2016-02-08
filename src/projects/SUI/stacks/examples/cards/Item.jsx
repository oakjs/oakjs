"use strict";
import React from "react";
import { Card } from "oak";

export default class ItemCard extends Card {
  static defaultProps = {
    id: "Item",
    title: "Item"
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
          <c.PageTitle title="Item">
            An item view presents large collections of site content for display
            <c.Info>Note that Item elements <b>must</b> appear inside an Items element to display properly.</c.Info>
          </c.PageTitle>

          <c.PageSection title="Content">

            <c.Example title="Inline Content" hint="<Item>...</Item>">
              <c.Items>
                <c.Item>
                  <div className="image">
                    <img src={data.image} className="ui image"/>
                  </div>
                  <div className="content">
                    <a className="header" href="#">Header</a>
                    <div className="meta">Description</div>
                    <div className="description">
                      <c.LoremIpsum short/>
                    </div>
                    <div className="extra">
                      Additional Details
                    </div>
                  </div>
                </c.Item>

                <c.Item>
                  <div className="image">
                    <img src={data.image} className="ui image"/>
                  </div>
                  <div className="content">
                    <a className="header" href="#">Header</a>
                    <div className="meta">Description</div>
                    <div className="description">
                      <c.LoremIpsum short/>
                    </div>
                    <div className="extra">
                      Additional Details
                    </div>
                  </div>
                </c.Item>
              </c.Items>
            </c.Example>

            <c.Example title="Image Attribute" hint="<Item image='...' imageAppearance='...'/>">
              <c.Items>
                <c.Item image={data.joeAvatar} imageAppearance='tiny'/>
                <c.Item image={data.kristyAvatar} imageAppearance='tiny'/>
                <c.Item image={data.elliotAvatar} imageAppearance='tiny'/>
              </c.Items>
            </c.Example>

            <c.Example title="Header Attribute" hint="<Item header='...'/>">
              <c.Items>
                <c.Item header="Joe Constance" image={data.joeAvatar} imageAppearance='tiny'/>
                <c.Item header="Kristy Bainbridge" image={data.kristyAvatar} imageAppearance='tiny'/>
                <c.Item header="Elliot Fu" image={data.elliotAvatar} imageAppearance='tiny'/>
              </c.Items>
            </c.Example>

            <c.Example title="Content Attribute" hint="<Item content='...'/>">
              <c.Items>
                <c.Item header="Joe Constance" content="Joe is a kung fu instructor living in New York" image={data.joeAvatar} imageAppearance='tiny'/>
                <c.Item header="Kristy Bainbridge" content="Kristy is a graphic designer living in New York" image={data.kristyAvatar} imageAppearance='tiny'/>
                <c.Item header="Elliot Fu" content="Elliot is a software manager living in New York" image={data.elliotAvatar} imageAppearance='tiny'/>
              </c.Items>
            </c.Example>

            <c.Example title="Meta Attribute" hint="<Item meta='...'/>">
              <c.Items>
                <c.Item meta="2,417 WOW! Points" header="Joe Constance" content="Joe is a kung fu instructor living in New York" image={data.joeAvatar}/>
                <c.Item meta="1,432 WOW! Points" header="Kristy Bainbridge" content="Kristy is a graphic designer living in New York" image={data.kristyAvatar}/>
                <c.Item meta="863 WOW! Points" header="Elliot Fu" content="Elliot is a software manager living in New York" image={data.elliotAvatar}/>
              </c.Items>
            </c.Example>

            <c.Example title="Extra Attribute" hint="<Item extra='...'/>">
              <c.Items>
                <c.Item extra={<a href="#">Add Friend</a>} meta="2,417 WOW! Points" header="Joe Constance" content="Joe is a kung fu instructor living in New York" image={data.joeAvatar}/>
                <c.Item extra="Kristy has been your friend since 2014" meta="1,432 WOW! Points" header="Kristy Bainbridge" content="Kristy is a graphic designer living in New York" image={data.kristyAvatar}/>
                <c.Item extra={<a href="#">Add Friend</a>} meta="863 WOW! Points" header="Elliot Fu" content="Elliot is a software manager living in New York" image={data.elliotAvatar}/>
              </c.Items>
            </c.Example>

          </c.PageSection>

          <c.PageSection title="Event Handling">

            <c.Example title="onClick" hint="<Item onClick={...}/>">
              <c.Items appearance="link">
                <c.Item onClick={()=> alert("Joe says Hi!")} meta="2,417 WOW! Points" header="Joe Constance" content="Joe is a kung fu instructor living in New York" image={data.joeAvatar}/>
                <c.Item onClick={()=> alert("Kristy says Hey, You!")} extra="Kristy has been your friend since 2014" meta="1,432 WOW! Points" header="Kristy Bainbridge" content="Kristy is a graphic designer living in New York" image={data.kristyAvatar}/>
                <c.Item onClick={()=> alert("Elliot says Howdy!")} meta="863 WOW! Points" header="Elliot Fu" content="Elliot is a software manager living in New York" image={data.elliotAvatar}/>
              </c.Items>
              <c.Info>If you have an `onClick`, the entire item is clickable.
                You should make sure any anchors or other elements inside your Item which might want intercept the click call `event.preventDefault()`.
              </c.Info>
            </c.Example>

          </c.PageSection>

          <c.PageSection title="Appearance">

            <c.Example title="Align attribute" hint="<Item align='top'/>">
              <c.Items>
                <c.Item align="top" header="Top Aligned" image={data.joeAvatar} imageAppearance='tiny'/>
                <c.Item align="middle" header="Middle Aligned" image={data.kristyAvatar} imageAppearance='tiny'/>
                <c.Item align="bottom" header="Bottom Aligned" image={data.elliotAvatar} imageAppearance='tiny'/>
              </c.Items>
            </c.Example>

          </c.PageSection>

        </c.Page>
      </c.CardContainer>
    );
  }
}

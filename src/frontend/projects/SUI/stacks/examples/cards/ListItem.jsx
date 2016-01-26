"use strict";
import React from "react";
import { Card } from "oak";


export default class ListItemCard extends Card {
  static defaultProps = {
    id: "ListItem",
    title: "ListItem"
  }

  static data = {
    joeAvatar: "http://semantic-ui.com/images/avatar/large/joe.jpg",
    elliotAvatar: "http://semantic-ui.com/images/avatar/large/elliot.jpg",
    stevieAvatar: "http://semantic-ui.com/images/avatar/large/stevie.jpg",
  };

  render() {
    const c = this.components;
    const data = this.constructor.data;

    return (
      <div {...this.renderProps}>
        <c.PageSidebar/>
        <c.Page>
          <c.PageTitle title="ListItem">
            A single item in a list.
          </c.PageTitle>

          <c.PageSection title="Content">
            <c.Grid columns={3}>
              <c.Column>
                <c.Example title="Text">
                  <c.List>
                    <c.ListItem content="Content attribute"/>
                    <c.ListItem>Inline content</c.ListItem>
                    <c.ListItem content="Content attribute"/>
                    <c.ListItem>Inline content</c.ListItem>
                  </c.List>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Icon">
                  <c.List appearance="divided">
                    <c.ListItem icon="top aligned help" header="Top Aligned" description="Top aligned by default"/>
                    <c.ListItem icon="middle aligned help" header="Middle aligned" description="Middle align is possible"/>
                    <c.ListItem icon="bottom aligned help" header="Bottom aligned" description="As is bottom align"/>
                    <c.ListItem><c.Icon icon="help"/>Inline content and icon</c.ListItem>
                  </c.List>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Image">
                  <c.List>
                    <c.ListItem image={data.joeAvatar} imageAppearance="avatar" header="Joe" description="240 points"/>
                    <c.ListItem image={data.elliotAvatar} imageAppearance="avatar" header="Elliot" description="120 points"/>
                    <c.ListItem image={data.stevieAvatar} imageAppearance="avatar" header="Stevie" description="30 points"/>
                  </c.List>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Links">
                  <c.List>
                    <c.ListItem href="http://www.google.com" target="_blank" content="Google"/>
                    <c.ListItem href="http://www.yahoo.com" target="_blank" content="Yahoo"/>
                    <c.ListItem href="http://www.apple.com" target="_blank" content="Apple"/>
                  </c.List>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Header">
                  <c.List>
                    <c.ListItem header="New York City">The Big Apple</c.ListItem>
                    <c.ListItem header="Chicago" content="The Windy City"/>
                    <c.ListItem header="Asheville" content="Indescribable"/>
                  </c.List>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Description">
                  <c.List>
                    <c.ListItem icon="marker" header="New York City" description="The Big Apple"/>
                    <c.ListItem icon="marker" header="Chicago" description="The Windy City"/>
                    <c.ListItem icon="marker" header="Asheville" description="Indescribable"/>
                  </c.List>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Vertical Alignment" hint="<ListItem align='middle'/>">
                  <c.List>
                    <c.ListItem image={data.joeAvatar} imageAppearance="avatar" align="top">Top Aligned</c.ListItem>
                    <c.ListItem image={data.joeAvatar} imageAppearance="avatar" align="middle">Middle Aligned</c.ListItem>
                    <c.ListItem image={data.joeAvatar} imageAppearance="avatar" align="bottom">Bottom Aligned</c.ListItem>
                  </c.List>
                </c.Example>
              </c.Column>


              <c.Column width={8}>
                <c.Example title="Floating elements">
                  <c.List appearance="relaxed divided">
                    <c.ListItem image={data.joeAvatar} imageAppearance="avatar" align="top" content="Joe" nestChildren={false}>
                      <div className="right floated content"><c.Button title="Add"/></div>
                    </c.ListItem>
                    <c.ListItem image={data.elliotAvatar} imageAppearance="avatar" align="middle" content="Elliot" nestChildren={false}>
                      <div className="right floated content"><c.Button title="Add"/></div>
                    </c.ListItem>
                    <c.ListItem image={data.stevieAvatar} imageAppearance="avatar" content="Stevie" nestChildren={false}>
                      <div className="right floated content"><c.Button title="Add"/></div>
                    </c.ListItem>
                  </c.List>
                </c.Example>
              </c.Column>
            </c.Grid>
          </c.PageSection>

        </c.Page>
      </div>
    );
  }
}

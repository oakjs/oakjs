"use strict";
import React from "react";
import { Card } from "oak";


export default class ListCard extends Card {
  static defaultProps = {
    id: "List",
    title: "List"
  }

  getInitialData() {
    return {
      joeAvatar: "http://semantic-ui.com/images/avatar/large/joe.jpg",
      elliotAvatar: "http://semantic-ui.com/images/avatar/large/elliot.jpg",
      stevieAvatar: "http://semantic-ui.com/images/avatar/large/stevie.jpg",
    }
  };

  // add render method so we get hot reload
  render() { return super.render() }
  
  // actual card render
  renderChildren({ data, card, stack, project, c }) {
    return (
      <c.CardContainer>
        <c.PageSidebar/>
        <c.Page>
          <c.PageTitle title="List">
            A list is used to group related content.
          </c.PageTitle>

          <c.PageSection title="Types">
            <c.Grid columns={3}>
              <c.Column>
                <c.Example title="Text / Icon only">
                  <c.List>
                    <c.ListItem content="Semantic UI" icon="users"/>
                    <c.ListItem><c.Icon icon="marker"/>Asheville, NC</c.ListItem>
                    <c.ListItem icon="mail"><a href="mailto:jack@semantic-ui.com">jack@semantic0ui.com</a></c.ListItem>
                  </c.List>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Link" hint="<List appearance='link'/>">
                  <c.List appearance="link">
                    <c.ListItem content="Home" href="http://google.com" target="_blank"/>
                    <c.ListItem content="About" active  href="http://google.com" target="_blank"/>
                    <c.ListItem content="Jobs"  href="http://google.com" target="_blank"/>
                    <c.ListItem content="Team"  href="http://google.com" target="_blank"/>
                  </c.List>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Fancy">
                  <c.List appearance="relaxed divided">
                    <c.ListItem icon="large github middle aligned" header="Semantic-UI" description="Updated 10 minutes ago"/>
                    <c.ListItem icon="large github middle aligned">
                      <div className="header">Semantic-UI-Docs</div>
                      <div className="description">Updated 22 minutes ago</div>
                    </c.ListItem>
                  </c.List>
                </c.Example>
              </c.Column>


              <c.Column columns={5}>
                <c.Example title="Bulleted Lists" hint="<List appearance='bulleted'/>">
                  <c.List appearance="bulleted">
                    <c.ListItem>Gaining Access</c.ListItem>
                    <c.ListItem>Inviting Friends</c.ListItem>
                    <c.ListItem nestChildren={false}>Benefits
                      <c.List>
                        <c.ListItem>Use Anywhere</c.ListItem>
                        <c.ListItem>Rebates</c.ListItem>
                        <c.ListItem>Discounts</c.ListItem>
                      </c.List>
                    </c.ListItem>
                    <c.ListItem>Warranty</c.ListItem>
                  </c.List>
                </c.Example>
              </c.Column>

              <c.Column columns={5}>
                <c.Example title="Ordered Lists" hint="<List appearance='ordered'/>">
                  <c.List appearance="ordered">
                    <c.ListItem>Gaining Access</c.ListItem>
                    <c.ListItem>Inviting Friends</c.ListItem>
                    <c.ListItem nestChildren={false}>Benefits
                      <c.List>
                        <c.ListItem>Use Anywhere</c.ListItem>
                        <c.ListItem>Rebates</c.ListItem>
                        <c.ListItem>Discounts</c.ListItem>
                      </c.List>
                    </c.ListItem>
                    <c.ListItem>Warranty</c.ListItem>
                  </c.List>
                </c.Example>
              </c.Column>

              <c.Column columns={6}>
                <c.Example title="Nested Lists">
                  <c.List>
                    <c.ListItem icon="folder" header="src" description="Source files for project">
                      <c.List>
                        <c.ListItem icon="folder" header="site" description="Your site's theme"/>
                        <c.ListItem icon="folder" header="themes" description="Packaged theme files">
                          <c.List>
                            <c.ListItem icon="folder" header="default" description="Default theme"/>
                            <c.ListItem icon="folder" header="my_theme" description="Custom themes"/>
                          </c.List>
                        </c.ListItem>
                        <c.ListItem icon="file" header="theme.config" description="Theme configuration file"/>
                      </c.List>
                    </c.ListItem>
                    <c.ListItem icon="folder" header="dist" description="Compiled CSS and JS files"/>
                  </c.List>
                </c.Example>
              </c.Column>

            </c.Grid>
          </c.PageSection>

          <c.PageSection title="Appearance">
            <c.Example title="Horizontal" hint="<List appearance='horizontal'/>">
              <c.List appearance="horizontal">
                <c.ListItem image={data.joeAvatar} imageAppearance="avatar" header="Joe" description="Top contributor"/>
                <c.ListItem image={data.elliotAvatar} imageAppearance="avatar" header="Elliot" description="Top Admin"/>
                <c.ListItem image={data.stevieAvatar} imageAppearance="avatar" header="Stevie" description="Top rated user"/>
              </c.List>

              <c.Divider/>
              <c.List appearance="horizontal divided">
                <c.ListItem image={data.joeAvatar} imageAppearance="avatar" header="Joe" description="Top contributor"/>
                <c.ListItem image={data.elliotAvatar} imageAppearance="avatar" header="Elliot" description="Top Admin"/>
                <c.ListItem image={data.stevieAvatar} imageAppearance="avatar" header="Stevie" description="Top rated user"/>
              </c.List>

              <c.Divider/>
              <c.List appearance="horizontal ordered">
                <c.ListItem image={data.joeAvatar} imageAppearance="avatar" header="Joe" description="50 points"/>
                <c.ListItem image={data.elliotAvatar} imageAppearance="avatar" header="Elliot" description="44 points"/>
                <c.ListItem image={data.stevieAvatar} imageAppearance="avatar" header="Stevie" description="22 points"/>
              </c.List>

              <c.Divider/>
              <c.List appearance="horizontal bulleted link">
                <c.ListItem href="http://www.google.com">Terms and Conditions</c.ListItem>
                <c.ListItem href="http://www.google.com">Privacy Policy</c.ListItem>
                <c.ListItem href="http://www.google.com">Contact Us</c.ListItem>
              </c.List>
            </c.Example>

            <c.Grid columns={3}>
              <c.Column>
                <c.Example title="Normal (non-relaxed)">
                  <c.List>
                    <c.ListItem image={data.joeAvatar} imageAppearance="avatar" header="Joe" description="Top contributor"/>
                    <c.ListItem image={data.elliotAvatar} imageAppearance="avatar" header="Elliot" description="Top Admin"/>
                    <c.ListItem image={data.stevieAvatar} imageAppearance="avatar" header="Stevie" description="Top rated user"/>
                  </c.List>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Relaxed" hint="<List appearance='relaxed'/>">
                  <c.List appearance="relaxed">
                    <c.ListItem image={data.joeAvatar} imageAppearance="avatar" header="Joe" description="Top contributor"/>
                    <c.ListItem image={data.elliotAvatar} imageAppearance="avatar" header="Elliot" description="Top Admin"/>
                    <c.ListItem image={data.stevieAvatar} imageAppearance="avatar" header="Stevie" description="Top rated user"/>
                  </c.List>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Very Relaxed" hint="<List appearance='very relaxed'/>">
                  <c.List appearance="very relaxed">
                    <c.ListItem image={data.joeAvatar} imageAppearance="avatar" header="Joe" description="Top contributor"/>
                    <c.ListItem image={data.elliotAvatar} imageAppearance="avatar" header="Elliot" description="Top Admin"/>
                    <c.ListItem image={data.stevieAvatar} imageAppearance="avatar" header="Stevie" description="Top rated user"/>
                  </c.List>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Divided" hint="<List appearance='divided'/>">
                  <c.List appearance="divided">
                    <c.ListItem image={data.joeAvatar} imageAppearance="avatar" header="Joe" description="Top contributor"/>
                    <c.ListItem image={data.elliotAvatar} imageAppearance="avatar" header="Elliot" description="Top Admin"/>
                    <c.ListItem image={data.stevieAvatar} imageAppearance="avatar" header="Stevie" description="Top rated user"/>
                  </c.List>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Celled" hint="<List appearance='celled'/>">
                  <c.List appearance="celled">
                    <c.ListItem image={data.joeAvatar} imageAppearance="avatar" header="Joe" description="Top contributor"/>
                    <c.ListItem image={data.elliotAvatar} imageAppearance="avatar" header="Elliot" description="Top Admin"/>
                    <c.ListItem image={data.stevieAvatar} imageAppearance="avatar" header="Stevie" description="Top rated user"/>
                  </c.List>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Inverted" hint="<List appearance='inverted'/>">
                  <c.Segment appearance="inverted">
                    <c.List appearance="inverted divided">
                      <c.ListItem image={data.joeAvatar} imageAppearance="avatar" header="Joe" description="Top contributor"/>
                      <c.ListItem image={data.elliotAvatar} imageAppearance="avatar" header="Elliot" description="Top Admin"/>
                      <c.ListItem image={data.stevieAvatar} imageAppearance="avatar" header="Stevie" description="Top rated user"/>
                    </c.List>
                  </c.Segment>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Selection" hint="<List appearance='selection'/>">
                  <c.List appearance="selection">
                    <c.ListItem image={data.joeAvatar} imageAppearance="avatar" header="Joe" description="Top contributor"/>
                    <c.ListItem image={data.elliotAvatar} imageAppearance="avatar" header="Elliot" description="Top Admin"/>
                    <c.ListItem image={data.stevieAvatar} imageAppearance="avatar" header="Stevie" description="Top rated user"/>
                  </c.List>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Animated" hint="<List appearance='animated'/>">
                  <c.List appearance="animated">
                    <c.ListItem image={data.joeAvatar} imageAppearance="avatar" header="Joe" description="Top contributor"/>
                    <c.ListItem image={data.elliotAvatar} imageAppearance="avatar" header="Elliot" description="Top Admin"/>
                    <c.ListItem image={data.stevieAvatar} imageAppearance="avatar" header="Stevie" description="Top rated user"/>
                  </c.List>
                </c.Example>
              </c.Column>

            </c.Grid>

            <c.Example title="Floating list" hint="<List floated='right'/>">
              <c.Segment>
                <c.List appearance="horizontal">
                  <c.ListItem>Terms</c.ListItem>
                  <c.ListItem>Privacy</c.ListItem>
                  <c.ListItem>Contact</c.ListItem>
                </c.List>
                <c.List floated="right" appearance="horizontal">
                  <c.ListItem>About Us</c.ListItem>
                  <c.ListItem>Jobs</c.ListItem>
                </c.List>
              </c.Segment>
            </c.Example>

            <c.Example title="Size" hint="<List size='large'/>">
              <c.List size="horizontal mini">
                <c.ListItem icon='mail' content="Mail"/> <c.ListItem icon='user' content="Contacts"/> <c.ListItem icon='calendar' content="Calendar"/>
              </c.List>

              <c.Spacer/>
              <c.List size="horizontal tiny">
                <c.ListItem icon='mail' content="Mail"/> <c.ListItem icon='user' content="Contacts"/> <c.ListItem icon='calendar' content="Calendar"/>
              </c.List>

              <c.Spacer/>
              <c.List size="horizontal small">
                <c.ListItem icon='mail' content="Mail"/> <c.ListItem icon='user' content="Contacts"/> <c.ListItem icon='calendar' content="Calendar"/>
              </c.List>

              <c.Spacer/>
              <c.List size="horizontal medium">
                <c.ListItem icon='mail' content="Mail"/> <c.ListItem icon='user' content="Contacts"/> <c.ListItem icon='calendar' content="Calendar"/>
              </c.List>

              <c.Spacer/>
              <c.List size="horizontal large">
                <c.ListItem icon='mail' content="Mail"/> <c.ListItem icon='user' content="Contacts"/> <c.ListItem icon='calendar' content="Calendar"/>
              </c.List>

              <c.Spacer/>
              <c.List size="horizontal huge">
                <c.ListItem icon='mail' content="Mail"/> <c.ListItem icon='user' content="Contacts"/> <c.ListItem icon='calendar' content="Calendar"/>
              </c.List>

              <c.Spacer/>
              <c.List size="horizontal massive">
                <c.ListItem icon='mail' content="Mail"/> <c.ListItem icon='user' content="Contacts"/> <c.ListItem icon='calendar' content="Calendar"/>
              </c.List>

            </c.Example>
          </c.PageSection>
        </c.Page>
      </c.CardContainer>
    );
  }
}

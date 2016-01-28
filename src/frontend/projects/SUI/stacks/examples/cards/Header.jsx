"use strict";
import React from "react";
import { Card } from "oak";

export default class HeaderCard extends Card {
  static defaultProps = {
    id: "Header",
    title: "Header"
  }
  // add render method so we get hot reload
  render() { return super.render() }

  // actual card render
  renderChildren({ data, card, stack, project, c }) {
    return (
      <c.CardContainer>
        <c.PageSidebar/>
        <c.Page>
          <c.PageTitle title="Header">
            A header provides a short summary of content.
            <ul>
              <li><b>&lt;Header&gt;</b> elements size according to surrounding content.</li>
              <li><b>&lt;Header page&gt;</b> elements are fixed in size and are not affected by their surrounding content.</li>
              <li><b>&lt;Header sub&gt;</b> elements are used for sub-header text.</li>
            </ul>
            Otherwise they both function identically.
          </c.PageTitle>

          <c.PageSection title="Types">

            <c.Example title="Normal Headers" hint="<Header size='huge'/>">
              <c.Info appearance="info">Normal headers <b>are</b> affected by surrounding content size.</c.Info>
              <c.Segment>
                <c.Header size="huge">First Header</c.Header>
                <c.LoremIpsum short/>
                <c.Header size="large">Second Header</c.Header>
                <c.LoremIpsum short/>
                <c.Header size="medium">Third Header</c.Header>
                <c.LoremIpsum short/>
                <c.Header size="small">Fourth Header</c.Header>
                <c.LoremIpsum short/>
                <c.Header size="tiny">Fifth Header</c.Header>
                <c.LoremIpsum short/>
              </c.Segment>
            </c.Example>

            <c.Example title="Page Headers" hint="<Header page size='huge'/>">
              <c.Info appearance="info">Page headers <b>are not</b> affected by surrounding content size.</c.Info>
              <c.Segment>
                <c.Header page size="huge">First Page Header</c.Header>
                <c.Header page size="large">Second Page Header</c.Header>
                <c.Header page size="medium">Third Page Header</c.Header>
                <c.Header page size="small">Fourth Page Header</c.Header>
                <c.Header page size="tiny">Fifth Page Header</c.Header>
              </c.Segment>
            </c.Example>

            <c.Example title="Sub Headers" hint="<Header sub size='huge'/>">
              <c.Segment>
                <c.Header sub size="huge">First Sub Header</c.Header>
                <c.Header sub size="large">Second Sub Header</c.Header>
                <c.Header sub size="medium">Third Sub Header</c.Header>
                <c.Header sub size="small">Fourth Sub Header</c.Header>
                <c.Header sub size="tiny">Fifth Sub Header</c.Header>
              </c.Segment>
            </c.Example>

            <c.Example title="Icon Headers" hint="<Header appearance='icon' icon='settings'/>">
              <c.Segment>
                <c.Grid>
                  <c.Column width={3}>
                    <c.Header page appearance="icon" icon="settings" align="center" size="small">Account Settings</c.Header>
                  </c.Column>
                  <c.Column width={13}>
                    <c.LoremIpsum medium/>
                  </c.Column>
                </c.Grid>
              </c.Segment>

              <c.Segment>
                <c.Header appearance="icon" icon="circular users" align="center" size="huge">Friends</c.Header>
                <c.LoremIpsum short/>
              </c.Segment>
            </c.Example>

          </c.PageSection>

          <c.PageSection title="Content">

            <c.Example title="Subheader" hint="<Header>Header Text<SubHeader>Sub header text</SubHeader></Header>">
              <c.Segment>
                <c.Header size="huge">
                  Account Settings
                  <c.SubHeader>Manage your settings and e-mail preferences.</c.SubHeader>
                </c.Header>
                <c.LoremIpsum short/>
              </c.Segment>

              <c.Segment>
                <c.Header size="huge" dividing>
                  H1
                  <c.SubHeader>Sub Header</c.SubHeader>
                </c.Header>
                <c.Header size="large" dividing>
                  H2
                  <c.SubHeader>Sub Header</c.SubHeader>
                </c.Header>
                <c.Header size="medium" dividing>
                  H3
                  <c.SubHeader>Sub Header</c.SubHeader>
                </c.Header>
                <c.Header size="small" dividing>
                  H4
                  <c.SubHeader>Sub Header</c.SubHeader>
                </c.Header>
                <c.Header size="tiny">
                  H5
                  <c.SubHeader>Sub Header</c.SubHeader>
                </c.Header>
              </c.Segment>

            </c.Example>

            <c.Example title="Icon" hint="<Header icon='...'/>">
              <c.Segment>
                <c.Header size="huge" icon="settings">Settings</c.Header>
                <c.LoremIpsum short/>
              </c.Segment>
            </c.Example>

            <c.Example title="Image" hint="<Header image='...'/>">
              <c.Segment>
                <c.Header size="huge" image="http://semantic-ui.com/images/avatar2/large/patrick.png">Patrick</c.Header>
                <c.LoremIpsum short/>
              </c.Segment>

              <c.Segment>
                <c.Header size="huge" image="http://semantic-ui.com/images/avatar2/large/patrick.png" imageAppearance="ui circular image">
                  Patrick
                  <c.SubHeader>A really spiffy guy</c.SubHeader>
                </c.Header>
                <c.LoremIpsum short/>
              </c.Segment>
            </c.Example>

          </c.PageSection>


          <c.PageSection title="Variations">


            <c.Example title="Text alignment" hint="<Header align='left'>Header Text</Header>">
              <c.Segment>
                <c.Header align="left">Left</c.Header>
                <c.Header align="center">Center</c.Header>
                <c.Header align="right">Right</c.Header>
                <c.Header align="justified">Justified Text Can Have Lots Of Spaces</c.Header>
              </c.Segment>
            </c.Example>

            <c.Example title="Floating" hint="<Header floated='left'>Header Text</Header>">
              <c.Segment>
                <c.Header floated="left">Go Back</c.Header>
                <c.Header floated="right">Go Forward</c.Header>
              </c.Segment>
            </c.Example>

            <c.Example title="Dividing" hint="<Header dividing>Header Text</Header>">
              <c.Segment>
                <c.LoremIpsum short/>
                <c.Header dividing>Dividing Header</c.Header>
                <c.LoremIpsum short/>
              </c.Segment>
            </c.Example>


            <c.Example title="Block" hint="<Header appearance='block'>Header Text</Header>">
              <c.Spacer/>
              <c.Segment appearance="basic unpadded">
                <c.Header appearance="block">Block Header</c.Header>
                <c.LoremIpsum short/>
              </c.Segment>
            </c.Example>


            <c.Example title="Attached" hint="<Header attached='top|bottom'>Header Text</Header>">
              <c.Header attached="top">Top Attached</c.Header>
              <c.Segment appearance="attached">
                <c.LoremIpsum short/>
              </c.Segment>
              <c.Header attached>Attached</c.Header>
              <c.Segment appearance="attached">
                <c.LoremIpsum short/>
              </c.Segment>
              <c.Header attached="bottom">Bottom Attached</c.Header>
            </c.Example>

            <c.Example title="Disabled" hint="<Header disabled>Header Text</Header>">
              <c.Segment>
                <c.Header disabled>
                  Disabled Header
                  <c.SubHeader>Manage your settings and e-mail preferences.</c.SubHeader>
                </c.Header>
                <c.LoremIpsum short/>
              </c.Segment>
            </c.Example>

            <c.Example title="Colored" hint="<Header color='red'>Header Text</Header>">
              <c.Segment>
                <c.Header size="tiny" color="red" dividing>Red</c.Header>
                <c.Header size="tiny" color="orange" dividing>Orange</c.Header>
                <c.Header size="tiny" color="yellow" dividing>Yellow</c.Header>
                <c.Header size="tiny" color="olive" dividing>Olive</c.Header>
                <c.Header size="tiny" color="green" dividing>Green</c.Header>
                <c.Header size="tiny" color="teal" dividing>Teal</c.Header>
                <c.Header size="tiny" color="blue" dividing>Blue</c.Header>
                <c.Header size="tiny" color="purple" dividing>Purple</c.Header>
                <c.Header size="tiny" color="violet" dividing>Violet</c.Header>
                <c.Header size="tiny" color="pink" dividing>Pink</c.Header>
                <c.Header size="tiny" color="brown" dividing>Brown</c.Header>
                <c.Header size="tiny" color="grey" dividing>Grey</c.Header>
              </c.Segment>
            </c.Example>

            <c.Example title="Inverted" hint="<Header appearance='inverted'>Header Text</Header>">
              <c.Segment appearance="inverted">
                <c.Header appearance="inverted" size="tiny">Normal</c.Header>
                <c.Header appearance="inverted" size="tiny" color="red">Red</c.Header>
                <c.Header appearance="inverted" size="tiny" color="orange">Orange</c.Header>
                <c.Header appearance="inverted" size="tiny" color="yellow">Yellow</c.Header>
                <c.Header appearance="inverted" size="tiny" color="olive">Olive</c.Header>
                <c.Header appearance="inverted" size="tiny" color="green">Green</c.Header>
                <c.Header appearance="inverted" size="tiny" color="teal">Teal</c.Header>
                <c.Header appearance="inverted" size="tiny" color="blue">Blue</c.Header>
                <c.Header appearance="inverted" size="tiny" color="purple">Purple</c.Header>
                <c.Header appearance="inverted" size="tiny" color="violet">Violet</c.Header>
                <c.Header appearance="inverted" size="tiny" color="pink">Pink</c.Header>
                <c.Header appearance="inverted" size="tiny" color="brown">Brown</c.Header>
                <c.Header appearance="inverted" size="tiny" color="grey">Grey</c.Header>
              </c.Segment>
            </c.Example>


          </c.PageSection>

        </c.Page>
      </c.CardContainer>
    );
  }
}

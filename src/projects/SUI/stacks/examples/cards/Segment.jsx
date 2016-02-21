"use strict";
import React from "react";
import Card from "oak/Card";

export default class SegmentCard extends Card {
  static defaultProps = {
    id: "Segment",
    title: "Segment"
  }
  // add render method so we get hot reload
  render() { return super.render() }

  // actual card render
  renderChildren({ data, card, stack, project, c }) {
    return (
      <c.CardContainer>
        <c.PageSidebar/>
        <c.Page>
          <c.PageTitle title="Segment">
            A segment is used to create a grouping of related content
          </c.PageTitle>

          <c.PageSection title="Types">

            <c.Example title="Normal">
              <c.Segment>
                <c.LoremIpsum short/>
              </c.Segment>
            </c.Example>

            <c.Example title="Raised" hint="<Segment appearance='raised'/>">
              <c.Segment appearance="raised">
                <c.LoremIpsum short/>
              </c.Segment>
            </c.Example>

            <c.Example title="Stacked" hint="<Segment appearance='stacked'/>">
              <c.Segment appearance="stacked">
                <c.LoremIpsum short/>
              </c.Segment>
            </c.Example>

            <c.Example title="Tall Stacked" hint="<Segment appearance='tall stacked'/>">
              <c.Segment appearance="tall stacked">
                <c.LoremIpsum short/>
              </c.Segment>
            </c.Example>

            <c.Example title="Piled" hint="<Segment appearance='piled'/>">
              <c.Segment appearance="piled">
                <c.LoremIpsum short/>
              </c.Segment>
            </c.Example>

            <c.Example title="Basic" hint="<Segment appearance='basic'/>">
              <c.Segment appearance='basic'>
                <c.LoremIpsum/>
              </c.Segment>
            </c.Example>

            <c.Example title="Vertical" hint="<Segment appearance='vertical'/>">
              <c.Segment appearance="vertical">
                <c.LoremIpsum short/>
              </c.Segment>
              <c.Segment appearance="vertical">
                <c.LoremIpsum short/>
              </c.Segment>
              <c.Segment appearance="vertical">
                <c.LoremIpsum short/>
              </c.Segment>
            </c.Example>
          </c.PageSection>

          <c.PageSection title="States">

            <c.Example title="Disabled" hint="<Segment disabled/>">
              <c.Segment disabled>
                <c.LoremIpsum short/>
              </c.Segment>
            </c.Example>

            <c.Example title="Loading" hint="<Segment loading/>">
              <c.Segment loading>
                <c.LoremIpsum short/>
              </c.Segment>
            </c.Example>

            <c.Example title="Hidden" hint="<Segment visible={false}/>">
              <c.Label pointing="right">Hidden segment here</c.Label>
              <c.Segment visible={false}>
                <c.LoremIpsum short/>
              </c.Segment>
              <c.Label pointing="left">Hidden segment here</c.Label>
            </c.Example>

          </c.PageSection>

          <c.PageSection title="Appearance">

            <c.Example title="Text Alignment" hint="<Segment/>">
              <c.Segment align="left">Left aligned</c.Segment>
              <c.Segment align="center">Center aligned</c.Segment>
              <c.Segment align="right">Right aligned</c.Segment>
            </c.Example>

            <c.Example title="Clearing" hint="<Segment clearing/>">
              <c.Segment clearing>
                <c.Button floated="right">I'm a floated button</c.Button>
              </c.Segment>
            </c.Example>

            <c.Example title="Floated" hint="<Segment floated='right'/>">
              <c.Segment floated="left">This segment appears to the left</c.Segment>
              <c.Segment floated="right">This segment appears to the right</c.Segment>
            </c.Example>

            <c.Example title="Inverted" hint="<Segment appearance='inverted'/>">
              <c.Segment appearance='inverted'>
                <c.LoremIpsum short/>
              </c.Segment>
            </c.Example>

            <c.Example title="Attached" hint="<Segment appearance='attached'/>">
              <c.Segment appearance='top attached'>
                <c.LoremIpsum tiny/>
              </c.Segment>
              <c.Segment appearance='attached'>
                <c.LoremIpsum tiny/>
              </c.Segment>
              <c.Segment appearance='bottom attached'>
                <c.LoremIpsum tiny/>
              </c.Segment>

              <c.Spacer/>
              <c.Header appearance='top attached'>
                Top attached header
              </c.Header>
              <c.Segment appearance='attached'>
                <c.LoremIpsum/>
              </c.Segment>
              <c.Message appearance='bottom attached'>
                Bottom attached message
              </c.Message>

            </c.Example>

            <c.Example title="Unpadded" hint="<Segment appearance='unpadded'/>">
              <c.Segment appearance='unpadded'>
                <c.LoremIpsum short/>
              </c.Segment>
            </c.Example>

            <c.Example title="Padded" hint="<Segment appearance='padded'/>">
              <c.Segment appearance='padded'>
                <c.LoremIpsum short/>
              </c.Segment>
            </c.Example>

            <c.Example title="Very Padded" hint="<Segment appearance='very padded'/>">
              <c.Segment appearance='very padded'>
                <c.LoremIpsum short/>
              </c.Segment>
            </c.Example>

            <c.Example title="Compact" hint="<Segment appearance='compact'/>">
              <c.Segment appearance='compact'>
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
              </c.Segment>
            </c.Example>

            <c.Grid columns={2}>
              <c.Column>
                <c.Example title="Colors" hint="<Segment color='red'/>">
                  <c.Segment color='red'>Red</c.Segment>
                  <c.Segment color='orange'>Orange</c.Segment>
                  <c.Segment color='yellow'>Yellow</c.Segment>
                  <c.Segment color='olive'>Olive</c.Segment>
                  <c.Segment color='green'>Green</c.Segment>
                  <c.Segment color='teal'>Teal</c.Segment>
                  <c.Segment color='blue'>Blue</c.Segment>
                  <c.Segment color='violet'>Violet</c.Segment>
                  <c.Segment color='purple'>Purple</c.Segment>
                  <c.Segment color='pink'>Pink</c.Segment>
                  <c.Segment color='brown'>Brown</c.Segment>
                  <c.Segment color='grey'>Grey</c.Segment>
                  <c.Segment color='black'>Black</c.Segment>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Inverted Colors" hint="<Segment color='red' appearance='inverted'/>">
                  <c.Segment appearance="inverted" color='red'>Red</c.Segment>
                  <c.Segment appearance="inverted" color='orange'>Orange</c.Segment>
                  <c.Segment appearance="inverted" color='yellow'>Yellow</c.Segment>
                  <c.Segment appearance="inverted" color='olive'>Olive</c.Segment>
                  <c.Segment appearance="inverted" color='green'>Green</c.Segment>
                  <c.Segment appearance="inverted" color='teal'>Teal</c.Segment>
                  <c.Segment appearance="inverted" color='blue'>Blue</c.Segment>
                  <c.Segment appearance="inverted" color='violet'>Violet</c.Segment>
                  <c.Segment appearance="inverted" color='purple'>Purple</c.Segment>
                  <c.Segment appearance="inverted" color='pink'>Pink</c.Segment>
                  <c.Segment appearance="inverted" color='brown'>Brown</c.Segment>
                  <c.Segment appearance="inverted" color='grey'>Grey</c.Segment>
                  <c.Segment appearance="inverted" color='black'>Black</c.Segment>
                </c.Example>
              </c.Column>
            </c.Grid>

            <c.Example title="Emphasis" hint="<Segment appearance='secondary'/> or <Segment appearance='tertiary'/>">
              <c.Grid columns={3}>
                <c.Column>
                  <c.Segment>
                    <c.LoremIpsum tiny/>
                  </c.Segment>

                  <c.Segment appearance="secondary">
                    <c.LoremIpsum tiny/>
                  </c.Segment>

                  <c.Segment appearance="tertiary">
                    <c.LoremIpsum tiny/>
                  </c.Segment>
                </c.Column>
                <c.Column>
                  <c.Segment appearance="inverted">
                    <c.LoremIpsum tiny/>
                  </c.Segment>

                  <c.Segment appearance="inverted secondary">
                    <c.LoremIpsum tiny/>
                  </c.Segment>

                  <c.Segment appearance="inverted tertiary">
                    <c.LoremIpsum tiny/>
                  </c.Segment>
                </c.Column>

                <c.Column>
                  <c.Segment appearance="red inverted">
                    <c.LoremIpsum tiny/>
                  </c.Segment>

                  <c.Segment appearance="red inverted secondary">
                    <c.LoremIpsum tiny/>
                  </c.Segment>

                  <c.Segment appearance="red inverted tertiary">
                    <c.LoremIpsum tiny/>
                  </c.Segment>
                </c.Column>
              </c.Grid>
            </c.Example>

            <c.Example title="Circular" hint="<Segment appearance='circular'/>">
              <c.Info>If you want to guarantee a perfect circle, manually match width and height of your content</c.Info>
              <c.Segment appearance='compact circular' style={{width:180, height:180}}>
                <c.Header size="large">Buy Now</c.Header>
                <c.Subheader>$10.99</c.Subheader>
              </c.Segment>

              <c.Segment appearance='compact circular inverted' style={{width:180, height:180}}>
                <c.Header size="large">Buy Now</c.Header>
                <c.Subheader>$10.99</c.Subheader>
              </c.Segment>

              <c.Segment appearance='compact circular inverted blue' style={{width:180, height:180}}>
                <c.Header size="large">Buy Now</c.Header>
                <c.Subheader>$10.99</c.Subheader>
              </c.Segment>
            </c.Example>



          </c.PageSection>


        </c.Page>
      </c.CardContainer>
    );
  }
}

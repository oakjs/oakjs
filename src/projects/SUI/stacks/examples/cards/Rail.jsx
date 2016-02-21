"use strict";
import React from "react";
import Card from "oak/Card";

export default class RailCard extends Card {
  static defaultProps = {
    id: "Rail",
    title: "Rail"
  }
  // add render method so we get hot reload
  render() { return super.render() }

  // actual card render
  renderChildren({ data, card, stack, project, c }) {
    return (
      <c.CardContainer>
        <c.PageSidebar/>
        <c.Page>
          <c.PageTitle title="Rail">
            A rail is used to show accompanying content outside the boundaries of the main view of a site.
          </c.PageTitle>

          <c.PageSection title="Appearance">

            <c.Example title="Left or Right" hint="<Rail left/>">
              <c.Segment style={{marginLeft:350}}>
                <c.Rail left>
                  <c.Segment>
                    Left rail content
                  </c.Segment>
                </c.Rail>
                <c.LoremIpsum short/>
              </c.Segment>

              <c.Segment style={{marginRight:350}}>
                <c.Rail right>
                  <c.Segment>
                    Right rail content
                  </c.Segment>
                </c.Rail>
                <c.LoremIpsum short/>
              </c.Segment>
            </c.Example>

            <c.Example title="Internal" hint="<Rail left internal/>">
              <c.Segment>
                <c.Rail left internal>
                  <c.Segment>
                    Left rail content
                  </c.Segment>
                </c.Rail>
                <c.LoremIpsum style={{marginLeft:350}} short/>
              </c.Segment>

              <c.Segment>
                <c.Rail right internal>
                  <c.Segment>
                    Right rail content
                  </c.Segment>
                </c.Rail>
                <c.LoremIpsum style={{marginRight:350}} short/>
              </c.Segment>
            </c.Example>
          </c.PageSection>

          <c.PageSection title="Appearance">

            <c.Example title="Dividing" hint="<Rail dividing/>">
              <c.Segment style={{marginLeft:350}}>
                <c.Rail dividing left>
                  Left rail content
                </c.Rail>
                <c.LoremIpsum short/>
              </c.Segment>
            </c.Example>

            <c.Example title="Close" hint="<Rail appearance='close'/> or <Rail appearance='very close'/>">
              <c.Segment style={{marginLeft:350}}>
                <c.Rail left appearance="close">
                  <c.Segment>
                    Left rail content
                  </c.Segment>
                </c.Rail>
                <c.LoremIpsum short/>
              </c.Segment>
            </c.Example>

            <c.Example title="Very Close" hint="<Rail appearance='very close'/>">
              <c.Segment style={{marginLeft:350}}>
                <c.Rail left appearance="very close">
                  <c.Segment>
                    Left rail content
                  </c.Segment>
                </c.Rail>
                <c.LoremIpsum short/>
              </c.Segment>
            </c.Example>

            <c.Example title="Attached" hint="<Rail appearance='attached'/>">
              <c.Segment style={{marginLeft:350}}>
                <c.Rail left appearance="attached">
                  <c.Segment>
                    Left rail content
                  </c.Segment>
                </c.Rail>
                <c.LoremIpsum short/>
              </c.Segment>
            </c.Example>


          </c.PageSection>

        </c.Page>
      </c.CardContainer>
    );
  }
}


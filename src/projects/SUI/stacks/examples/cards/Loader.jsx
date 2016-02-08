"use strict";
import React from "react";
import { Card } from "oak";

export default class LoaderCard extends Card {
  static defaultProps = {
    id: "Loader",
    title: "Loader"
  }
  // add render method so we get hot reload
  render() { return super.render() }

  // actual card render
  renderChildren({ data, card, stack, project, c }) {
    return (
      <c.CardContainer>
        <c.PageSidebar/>
        <c.Page>
          <c.PageTitle title="Loader">
          A loader alerts a user to wait for an activity to complete
          </c.PageTitle>

          <c.PageSection title="Types">

            <c.Example title="Simple">
              <c.Segment>
                <c.LoremIpsum short/>
                <c.Dimmer visible>
                  <c.Loader/>
                </c.Dimmer>
              </c.Segment>
            </c.Example>

            <c.Example title="Text content" hint="<Loader content='...'/> or <Loader>...</Loader>">
              <c.Segment>
                <c.LoremIpsum short/>
                <c.Dimmer visible>
                  <c.Loader content="Content attribute"/>
                </c.Dimmer>
              </c.Segment>

              <c.Segment>
                <c.LoremIpsum short/>
                <c.Dimmer visible>
                  <c.Loader>Inline content</c.Loader>
                </c.Dimmer>
              </c.Segment>
            </c.Example>

          </c.PageSection>

          <c.PageSection title="States">

            <c.Example title="Active" hint="<Loader active/>">
              <c.Segment>
                <c.Loader active/>
                <c.LoremIpsum short/>
              </c.Segment>
              <c.Info>An active loader may not be completely visible if not inside a dimmer</c.Info>
            </c.Example>

            <c.Example title="Indeterminate" hint="<Loader indeterminate/>">
              <c.Segment>
                <c.Dimmer visible>
                  <c.Loader indeterminate>Preparing files</c.Loader>
                </c.Dimmer>
                <c.LoremIpsum short/>
              </c.Segment>
            </c.Example>

            <c.Example title="Hidden" hint="<Loader hidden/>">
              <c.Segment>
                <c.Label pointing="right" content="Hidden loader here"/>
                <c.Loader hidden>Preparing files</c.Loader>
                <c.Label pointing="left" content="Hidden loader here"/>
              </c.Segment>
            </c.Example>

            <c.Example title="Disabled" hint="<Loader disabled/>">
              <c.Segment>
                <c.Label pointing="right" content="Disabled loader here"/>
                <c.Loader disabled>Preparing files</c.Loader>
                <c.Label pointing="left" content="Disabled loader here"/>
              </c.Segment>
            </c.Example>

          </c.PageSection>


          <c.PageSection title="Appearance">

            <c.Example title="Inverted" hint="<Loader appearance='inverted'/>">
              <c.Segment appearance="inverted">
                <c.Loader appearance='inverted' content="Loading..." active/>
                <br/>
                <br/>
                <br/>
              </c.Segment>
              <c.Info>Loaders will automatically be inverted inside an inverted dimmer.</c.Info>

              <c.Segment>
                <c.Dimmer appearance="blurring inverted" visible>
                  <c.Loader content="Loading"/>
                </c.Dimmer>
                <c.LoremIpsum short/>
              </c.Segment>
            </c.Example>

            <c.Example title="Inline" hint="<Loader appearance='inline'/>">
              <c.Segment>
                <c.Loader appearance='inline' active size='small'/>
                <c.Loader appearance='inline' active size='medium'/>
                <c.Loader appearance='inline' active size='large'/>
              </c.Segment>
            </c.Example>

            <c.Example title="Sizes" hint="<Loader size='large'/>">
              <c.Grid columns={2}>
                <c.Column>
                  <c.Segment>
                    <c.Dimmer visible>
                      <c.Loader active size='mini' content="Mini loader"/>
                    </c.Dimmer>
                    <c.LoremIpsum tiny/>
                  </c.Segment>

                  <c.Segment>
                    <c.Dimmer visible>
                      <c.Loader active size='small' content="Small loader"/>
                    </c.Dimmer>
                    <c.LoremIpsum short/>
                  </c.Segment>

                  <c.Segment>
                    <c.Dimmer visible>
                      <c.Loader active size='medium' content="Medium loader (default size)"/>
                    </c.Dimmer>
                    <c.LoremIpsum medium/>
                  </c.Segment>

                  <c.Segment>
                    <c.Dimmer visible>
                      <c.Loader active size='large' content="Large loader"/>
                    </c.Dimmer>
                    <c.LoremIpsum/>
                  </c.Segment>
                </c.Column>
                <c.Column>
                  <c.Segment>
                    <c.Dimmer visible appearance="inverted">
                      <c.Loader active size='mini' content="Mini loader"/>
                    </c.Dimmer>
                    <c.LoremIpsum tiny/>
                  </c.Segment>

                  <c.Segment>
                    <c.Dimmer visible appearance="inverted">
                      <c.Loader active size='small' content="Small loader"/>
                    </c.Dimmer>
                    <c.LoremIpsum short/>
                  </c.Segment>

                  <c.Segment>
                    <c.Dimmer visible appearance="inverted">
                      <c.Loader active size='medium' content="Medium loader (default size)"/>
                    </c.Dimmer>
                    <c.LoremIpsum medium/>
                  </c.Segment>

                  <c.Segment>
                    <c.Dimmer visible appearance="inverted">
                      <c.Loader active size='large' content="Large loader"/>
                    </c.Dimmer>
                    <c.LoremIpsum/>
                  </c.Segment>

                </c.Column>
              </c.Grid>

            </c.Example>

          </c.PageSection>

        </c.Page>
      </c.CardContainer>
    );
  }
}

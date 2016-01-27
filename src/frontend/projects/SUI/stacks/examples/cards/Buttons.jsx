"use strict";
import React from "react";
import { Card } from "oak";

export default class ButtonsCard extends Card {
  static defaultProps = {
    id: "Buttons",
    title: "Buttons"
  }
  render() {
    const c = this.components;
    return (
      <div {...this.renderProps}>
        <c.PageSidebar/>
        <c.Page>
          <c.PageTitle title="Buttons">
            A Buttons encapsulates a set of Button elements, generally to provide consistent styling.
          </c.PageTitle>

          <c.PageSection title="Appearance">
            <c.Example title="Normal">
              <c.Buttons>
                <c.Button title="One"/>
                <c.Button title="Two"/>
                <c.Button title="Three"/>
              </c.Buttons>
            </c.Example>

            <c.Example title="Compact">
              <c.Buttons compact>
                <c.Button>One</c.Button>
                <c.Button>Two</c.Button>
              </c.Buttons>
            </c.Example>

            <c.Example title="Icon Buttons">
              <c.Buttons appearance="icon">
                <c.Button icon="align left"/>
                <c.Button icon="align center"/>
                <c.Button icon="align right"/>
                <c.Button icon="align justify"/>
              </c.Buttons>
              <c.Spacer inline/>
              <c.Buttons appearance="icon">
                <c.Button icon="bold"/>
                <c.Button icon="underline"/>
                <c.Button icon="text width"/>
              </c.Buttons>
            </c.Example>

            <c.Example title="Labeled Icon Buttons">
              <c.Buttons appearance="vertical labeled icon">
                <c.Button icon="play" title="Play"/>
                <c.Button icon="pause" title="Pause"/>
                <c.Button icon="shuffle" title="Shuffle"/>
              </c.Buttons>
            </c.Example>

            <c.Example title="Mixed Group">
              <c.Buttons>
                <c.Button icon="left chevron" appearance="labeled icon" title="Back"/>
                <c.Button icon="stop" title="Stop"/>
                <c.Button icon="right chevron" appearance="right labeled icon" title="Forward"/>
              </c.Buttons>
            </c.Example>

            <c.Example title="Conditionals">
              <c.Buttons>
                <c.Button>Cancel</c.Button>
                <c.Conditional/>
                <c.Button color="positive">Save</c.Button>
              </c.Buttons>
            </c.Example>

            <c.Example title="Colored Buttons">
              <c.Buttons color="blue">
                <c.Button title="One"/>
                <c.Button title="Two"/>
                <c.Button title="Three"/>
              </c.Buttons>
            </c.Example>

            <c.Example title="Basic Buttons">
              <c.Buttons appearance="basic">
                <c.Button title="One"/>
                <c.Button title="Two"/>
                <c.Button title="Three"/>
              </c.Buttons>

              <c.Spacer/>
              <c.Buttons>
                <c.Button title="One" color="red" appearance="basic"/>
                <c.Button title="Two" color="blue" appearance="basic"/>
                <c.Button title="Three" color="green" appearance="basic"/>
              </c.Buttons>
            </c.Example>


            <c.Example title="Vertical">
              <c.Buttons appearance="vertical">
                <c.Button title="One"/>
                <c.Button title="Two"/>
                <c.Button title="Three"/>
              </c.Buttons>

              <c.Spacer inline/>
              <c.Buttons appearance="vertical" color="blue">
                <c.Button title="One"/>
                <c.Button title="Two"/>
                <c.Button title="Three"/>
              </c.Buttons>

              <c.Spacer inline/>
              <c.Buttons appearance="vertical">
                <c.Button title="One" color="red"/>
                <c.Button title="Two" color="blue"/>
                <c.Button title="Three" color="green"/>
              </c.Buttons>

              <c.Spacer inline size="large"/>
              <c.Buttons appearance="vertical basic">
                <c.Button title="One"/>
                <c.Button title="Two"/>
                <c.Button title="Three"/>
              </c.Buttons>

              <c.Spacer inline/>
              <c.Buttons appearance="vertical basic" color="blue">
                <c.Button title="One"/>
                <c.Button title="Two"/>
                <c.Button title="Three"/>
              </c.Buttons>

              <c.Spacer inline/>
              <c.Buttons appearance="vertical basic">
                <c.Button title="One" color="red" appearance="basic"/>
                <c.Button title="Two" color="blue" appearance="basic"/>
                <c.Button title="Three" color="green" appearance="basic"/>
              </c.Buttons>
            </c.Example>
          </c.PageSection>

            <c.PageSection title="Sizing">
            <c.Example title="Group Sizes">
              <c.Buttons size="tiny">
                <c.Button title="We"/>
                <c.Button title="Are"/>
                <c.Button title="Tiny!"/>
              </c.Buttons>

              <c.Spacer/>
              <c.Buttons size="large" appearance="basic icon">
                <c.Button icon="file"/>
                <c.Button icon="save"/>
                <c.Button icon="upload"/>
                <c.Button icon="download"/>
              </c.Buttons>

              <c.Spacer/>
              <c.Buttons size="huge">
                <c.Button title="One"/>
                <c.Conditional/>
                <c.Button title="Two"/>
                <c.Conditional/>
                <c.Button title="Three"/>
              </c.Buttons>
            </c.Example>

            <c.Example title="Fluid">
              <c.Buttons appearance="fluid">
                <c.Button title="Overview"/>
                <c.Button title="Specs"/>
                <c.Button title="Warranty"/>
                <c.Button title="Reviews"/>
                <c.Button title="Support"/>
              </c.Buttons>
            </c.Example>

            <c.Example title="Equal Width">
              <c.Buttons count={5}>
                <c.Button title="Overview"/>
                <c.Button title="Specs"/>
                <c.Button title="Warranty"/>
                <c.Button title="Reviews"/>
                <c.Button title="Support"/>
              </c.Buttons>
              <c.Spacer/>
              <c.Buttons count={3}>
                <c.Button title="Overview"/>
                <c.Button title="Specs"/>
                <c.Button title="Support"/>
              </c.Buttons>
            </c.Example>
          </c.PageSection>

          <c.PageSection title="Attachment">
            <c.Example title="Floated">
              <c.Segment clearing appearance="unpadded basic">
                <c.Buttons floated="left">
                  <c.Button icon="left arrow"/>
                  <c.Button icon="right arrow"/>
                </c.Buttons>
                <c.Buttons floated="right">
                  <c.Button icon="left arrow"/>
                  <c.Button icon="right arrow"/>
                </c.Buttons>
              </c.Segment>
            </c.Example>


            <c.Example title="Vertically Attached">
              <c.Buttons attached="top">
                <c.Button title="One"/>
                <c.Button title="Two"/>
              </c.Buttons>
              <c.Segment appearance="attached"><p>Segment Content Here</p></c.Segment>
              <c.Buttons attached="bottom">
                <c.Button title="One"/>
                <c.Button title="Two"/>
              </c.Buttons>
            </c.Example>
          </c.PageSection>

        </c.Page>
      </div>
    );
  }
}

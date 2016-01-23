"use strict";
import React from "react";
import { Card } from "oak";

export default class ButtonGroupCard extends Card {
  static defaultProps = {
    id: "ButtonGroup",
    title: "<ButtonGroup> Examples"
  }
  render() {
    const c = this.components;
    return (
      <div {...this.renderProps}>
        <c.PageSidebar/>
        <c.Page title="ButtonGroup" description="A ButtonGroup encapsulates a set of Button elements, generally to provide consistent styling.">
          <c.Section title="Appearance">
            <c.Example title="Normal">
              <c.ButtonGroup>
                <c.Button title="One"/>
                <c.Button title="Two"/>
                <c.Button title="Three"/>
              </c.ButtonGroup>
            </c.Example>

            <c.Example title="Compact">
              <c.ButtonGroup compact>
                <c.Button>One</c.Button>
                <c.Button>Two</c.Button>
              </c.ButtonGroup>
            </c.Example>

            <c.Example title="Icon Buttons">
              <c.ButtonGroup appearance="icon">
                <c.Button icon="align left"/>
                <c.Button icon="align center"/>
                <c.Button icon="align right"/>
                <c.Button icon="align justify"/>
              </c.ButtonGroup>
              <c.Spacer inline/>
              <c.ButtonGroup appearance="icon">
                <c.Button icon="bold"/>
                <c.Button icon="underline"/>
                <c.Button icon="text width"/>
              </c.ButtonGroup>
            </c.Example>

            <c.Example title="Labeled Icon Buttons">
              <c.ButtonGroup appearance="vertical labeled icon">
                <c.Button icon="play" title="Play"/>
                <c.Button icon="pause" title="Pause"/>
                <c.Button icon="shuffle" title="Shuffle"/>
              </c.ButtonGroup>
            </c.Example>

            <c.Example title="Mixed Group">
              <c.ButtonGroup>
                <c.Button icon="left chevron" appearance="labeled icon" title="Back"/>
                <c.Button icon="stop" title="Stop"/>
                <c.Button icon="right chevron" appearance="right labeled icon" title="Forward"/>
              </c.ButtonGroup>
            </c.Example>

            <c.Example title="Conditionals">
              <c.ButtonGroup>
                <c.Button>Cancel</c.Button>
                <c.Conditional/>
                <c.Button color="positive">Save</c.Button>
              </c.ButtonGroup>
            </c.Example>

            <c.Example title="Colored Buttons">
              <c.ButtonGroup color="blue">
                <c.Button title="One"/>
                <c.Button title="Two"/>
                <c.Button title="Three"/>
              </c.ButtonGroup>
            </c.Example>

            <c.Example title="Basic Buttons">
              <c.ButtonGroup appearance="basic">
                <c.Button title="One"/>
                <c.Button title="Two"/>
                <c.Button title="Three"/>
              </c.ButtonGroup>

              <c.Spacer/>
              <c.ButtonGroup>
                <c.Button title="One" color="red" appearance="basic"/>
                <c.Button title="Two" color="blue" appearance="basic"/>
                <c.Button title="Three" color="green" appearance="basic"/>
              </c.ButtonGroup>
            </c.Example>


            <c.Example title="Vertical">
              <c.ButtonGroup appearance="vertical">
                <c.Button title="One"/>
                <c.Button title="Two"/>
                <c.Button title="Three"/>
              </c.ButtonGroup>

              <c.Spacer inline/>
              <c.ButtonGroup appearance="vertical" color="blue">
                <c.Button title="One"/>
                <c.Button title="Two"/>
                <c.Button title="Three"/>
              </c.ButtonGroup>

              <c.Spacer inline/>
              <c.ButtonGroup appearance="vertical">
                <c.Button title="One" color="red"/>
                <c.Button title="Two" color="blue"/>
                <c.Button title="Three" color="green"/>
              </c.ButtonGroup>

              <c.Spacer inline size="large"/>
              <c.ButtonGroup appearance="vertical basic">
                <c.Button title="One"/>
                <c.Button title="Two"/>
                <c.Button title="Three"/>
              </c.ButtonGroup>

              <c.Spacer inline/>
              <c.ButtonGroup appearance="vertical basic" color="blue">
                <c.Button title="One"/>
                <c.Button title="Two"/>
                <c.Button title="Three"/>
              </c.ButtonGroup>

              <c.Spacer inline/>
              <c.ButtonGroup appearance="vertical basic">
                <c.Button title="One" color="red" appearance="basic"/>
                <c.Button title="Two" color="blue" appearance="basic"/>
                <c.Button title="Three" color="green" appearance="basic"/>
              </c.ButtonGroup>
            </c.Example>
          </c.Section>

            <c.Section title="Sizing">
            <c.Example title="Group Sizes">
              <c.ButtonGroup size="tiny">
                <c.Button title="We"/>
                <c.Button title="Are"/>
                <c.Button title="Tiny!"/>
              </c.ButtonGroup>

              <c.Spacer/>
              <c.ButtonGroup size="large" appearance="basic icon">
                <c.Button icon="file"/>
                <c.Button icon="save"/>
                <c.Button icon="upload"/>
                <c.Button icon="download"/>
              </c.ButtonGroup>

              <c.Spacer/>
              <c.ButtonGroup size="huge">
                <c.Button title="One"/>
                <c.Conditional/>
                <c.Button title="Two"/>
                <c.Conditional/>
                <c.Button title="Three"/>
              </c.ButtonGroup>
            </c.Example>

            <c.Example title="Fluid">
              <c.ButtonGroup appearance="fluid">
                <c.Button title="Overview"/>
                <c.Button title="Specs"/>
                <c.Button title="Warranty"/>
                <c.Button title="Reviews"/>
                <c.Button title="Support"/>
              </c.ButtonGroup>
            </c.Example>

            <c.Example title="Equal Width">
              <c.ButtonGroup count={5}>
                <c.Button title="Overview"/>
                <c.Button title="Specs"/>
                <c.Button title="Warranty"/>
                <c.Button title="Reviews"/>
                <c.Button title="Support"/>
              </c.ButtonGroup>
              <c.Spacer/>
              <c.ButtonGroup count={3}>
                <c.Button title="Overview"/>
                <c.Button title="Specs"/>
                <c.Button title="Support"/>
              </c.ButtonGroup>
            </c.Example>
          </c.Section>

          <c.Section title="Attachment">
            <c.Example title="Floated">
              <c.Segment clearing appearance="unpadded basic">
                <c.ButtonGroup float="left">
                  <c.Button icon="left arrow"/>
                  <c.Button icon="right arrow"/>
                </c.ButtonGroup>
                <c.ButtonGroup float="right">
                  <c.Button icon="left arrow"/>
                  <c.Button icon="right arrow"/>
                </c.ButtonGroup>
              </c.Segment>
            </c.Example>


            <c.Example title="Vertically Attached">
              <c.ButtonGroup attached="top">
                <c.Button title="One"/>
                <c.Button title="Two"/>
              </c.ButtonGroup>
              <c.Segment appearance="attached"><p>Segment Content Here</p></c.Segment>
              <c.ButtonGroup attached="bottom">
                <c.Button title="One"/>
                <c.Button title="Two"/>
              </c.ButtonGroup>
            </c.Example>
          </c.Section>

        </c.Page>
      </div>
    );
  }
}

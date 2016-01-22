"use strict";
import React from "react";

// use stack components
import components from "../../components";

export default class ButtonGroupCard extends React.Component {
  render() {
    const { Card, Example, Page, PageSidebar, Section } = components;
    const { Button, ButtonGroup, Container, Conditional, Icon, Message, Segment, Spacer } = components;
    return (
      <Card id="ButtonGroup" title="<ButtonGroup> Examples">
        <PageSidebar/>
        <Page title="ButtonGroup" description="A ButtonGroup encapsulates a set of Button elements, generally to provide consistent styling.">
          <Section title="Appearance">
            <Example title="Normal">
              <ButtonGroup>
                <Button title="One"/>
                <Button title="Two"/>
                <Button title="Three"/>
              </ButtonGroup>
            </Example>

            <Example title="Compact">
              <ButtonGroup compact>
                <Button>One</Button>
                <Button>Two</Button>
              </ButtonGroup>
            </Example>

            <Example title="Icon Buttons">
              <ButtonGroup appearance="icon">
                <Button icon="align left"/>
                <Button icon="align center"/>
                <Button icon="align right"/>
                <Button icon="align justify"/>
              </ButtonGroup>
              <Spacer inline/>
              <ButtonGroup appearance="icon">
                <Button icon="bold"/>
                <Button icon="underline"/>
                <Button icon="text width"/>
              </ButtonGroup>
            </Example>

            <Example title="Labeled Icon Buttons">
              <ButtonGroup appearance="vertical labeled icon">
                <Button icon="play" title="Play"/>
                <Button icon="pause" title="Pause"/>
                <Button icon="shuffle" title="Shuffle"/>
              </ButtonGroup>
            </Example>

            <Example title="Mixed Group">
              <ButtonGroup>
                <Button icon="left chevron" appearance="labeled icon" title="Back"/>
                <Button icon="stop" title="Stop"/>
                <Button icon="right chevron" appearance="right labeled icon" title="Forward"/>
              </ButtonGroup>
            </Example>

            <Example title="Conditionals">
              <ButtonGroup>
                <Button>Cancel</Button>
                <Conditional/>
                <Button color="positive">Save</Button>
              </ButtonGroup>
            </Example>

            <Example title="Colored Buttons">
              <ButtonGroup color="blue">
                <Button title="One"/>
                <Button title="Two"/>
                <Button title="Three"/>
              </ButtonGroup>
            </Example>

            <Example title="Basic Buttons">
              <ButtonGroup appearance="basic">
                <Button title="One"/>
                <Button title="Two"/>
                <Button title="Three"/>
              </ButtonGroup>

              <Spacer/>
              <ButtonGroup>
                <Button title="One" color="red" appearance="basic"/>
                <Button title="Two" color="blue" appearance="basic"/>
                <Button title="Three" color="green" appearance="basic"/>
              </ButtonGroup>
            </Example>


            <Example title="Vertical">
              <ButtonGroup appearance="vertical">
                <Button title="One"/>
                <Button title="Two"/>
                <Button title="Three"/>
              </ButtonGroup>

              <Spacer inline/>
              <ButtonGroup appearance="vertical" color="blue">
                <Button title="One"/>
                <Button title="Two"/>
                <Button title="Three"/>
              </ButtonGroup>

              <Spacer inline/>
              <ButtonGroup appearance="vertical">
                <Button title="One" color="red"/>
                <Button title="Two" color="blue"/>
                <Button title="Three" color="green"/>
              </ButtonGroup>

              <Spacer inline size="large"/>
              <ButtonGroup appearance="vertical basic">
                <Button title="One"/>
                <Button title="Two"/>
                <Button title="Three"/>
              </ButtonGroup>

              <Spacer inline/>
              <ButtonGroup appearance="vertical basic" color="blue">
                <Button title="One"/>
                <Button title="Two"/>
                <Button title="Three"/>
              </ButtonGroup>

              <Spacer inline/>
              <ButtonGroup appearance="vertical basic">
                <Button title="One" color="red" appearance="basic"/>
                <Button title="Two" color="blue" appearance="basic"/>
                <Button title="Three" color="green" appearance="basic"/>
              </ButtonGroup>
            </Example>
          </Section>

            <Section title="Sizing">
            <Example title="Group Sizes">
              <ButtonGroup size="tiny">
                <Button title="We"/>
                <Button title="Are"/>
                <Button title="Tiny!"/>
              </ButtonGroup>

              <Spacer/>
              <ButtonGroup size="large" appearance="basic icon">
                <Button icon="file"/>
                <Button icon="save"/>
                <Button icon="upload"/>
                <Button icon="download"/>
              </ButtonGroup>

              <Spacer/>
              <ButtonGroup size="huge">
                <Button title="One"/>
                <Conditional/>
                <Button title="Two"/>
                <Conditional/>
                <Button title="Three"/>
              </ButtonGroup>
            </Example>

            <Example title="Fluid">
              <ButtonGroup appearance="fluid">
                <Button title="Overview"/>
                <Button title="Specs"/>
                <Button title="Warranty"/>
                <Button title="Reviews"/>
                <Button title="Support"/>
              </ButtonGroup>
            </Example>

            <Example title="Equal Width">
              <ButtonGroup count={5}>
                <Button title="Overview"/>
                <Button title="Specs"/>
                <Button title="Warranty"/>
                <Button title="Reviews"/>
                <Button title="Support"/>
              </ButtonGroup>
              <Spacer/>
              <ButtonGroup count={3}>
                <Button title="Overview"/>
                <Button title="Specs"/>
                <Button title="Support"/>
              </ButtonGroup>
            </Example>
          </Section>

          <Section title="Attachment">
            <Example title="Floated">
              <Segment clearing appearance="unpadded basic">
                <ButtonGroup float="left">
                  <Button icon="left arrow"/>
                  <Button icon="right arrow"/>
                </ButtonGroup>
                <ButtonGroup float="right">
                  <Button icon="left arrow"/>
                  <Button icon="right arrow"/>
                </ButtonGroup>
              </Segment>
            </Example>


            <Example title="Vertically Attached">
              <ButtonGroup attached="top">
                <Button title="One"/>
                <Button title="Two"/>
              </ButtonGroup>
              <Segment appearance="attached"><p>Segment Content Here</p></Segment>
              <ButtonGroup attached="bottom">
                <Button title="One"/>
                <Button title="Two"/>
              </ButtonGroup>
            </Example>
          </Section>

        </Page>
      </Card>
    );
  }
}

"use strict";
import React from "react";
import oak, { Card } from "oak";

// just use project components
import components from "projects/SUI/components";

export default class ButtonGroupCard extends Card {
	static defaultProps = {
		id: "ButtonGroup",
		title: "<ButtonGroup> Examples"
	};

  // Remember imported components
  static components = components;

  renderChildren() {
    const { Button, ButtonGroup, Container, Conditional, Icon, Message, Segment, Spacer } = this.components;
    return (
      <Container>
        <h1>&lt;ButtonGroup&gt; Tests</h1>
        <div>A &lt;ButtonGroup&gt; encapsulates a set of &lt;Button&gt; elements.</div>

        <h3>Normal</h3>
        <ButtonGroup>
          <Button title="One"/>
          <Button title="Two"/>
          <Button title="Three"/>
        </ButtonGroup>

        <h3>Compact</h3>
        <ButtonGroup compact>
          <Button>One</Button>
          <Button>Two</Button>
        </ButtonGroup>

        <h3>Icon Buttons</h3>
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

        <h3>Labeled Icon Buttons</h3>
        <ButtonGroup appearance="vertical labeled icon">
          <Button icon="play" title="Play"/>
          <Button icon="pause" title="Pause"/>
          <Button icon="shuffle" title="Shuffle"/>
        </ButtonGroup>

        <h3>Mixed Group</h3>
        <ButtonGroup>
          <Button icon="left chevron" appearance="labeled icon" title="Back"/>
          <Button icon="stop" title="Stop"/>
          <Button icon="right chevron" appearance="right labeled icon" title="Forward"/>
        </ButtonGroup>

        <h3>Conditionals</h3>
        <ButtonGroup>
          <Button>Cancel</Button>
          <Conditional/>
          <Button color="positive">Save</Button>
        </ButtonGroup>


        <h3>Colored Buttons</h3>
        <ButtonGroup color="blue">
          <Button title="One"/>
          <Button title="Two"/>
          <Button title="Three"/>
        </ButtonGroup>

        <h3>Basic Buttons</h3>
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


        <h3>Vertical</h3>
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

        <Spacer size="huge"/>
        <Segment appearance="inverted">
          <h2>Sizing</h2>
        </Segment>

        <h3>Group Sizes</h3>
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

        <h3>Fluid</h3>
        <ButtonGroup appearance="fluid">
          <Button title="Overview"/>
          <Button title="Specs"/>
          <Button title="Warranty"/>
          <Button title="Reviews"/>
          <Button title="Support"/>
        </ButtonGroup>

        <h3>Equal Width</h3>
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

        <Spacer size="huge"/>
        <Segment appearance="inverted">
          <h2>Attachment</h2>
        </Segment>

        <h3>Floated</h3>
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


        <h3>Vertically Attached</h3>
        <ButtonGroup attached="top">
          <Button title="One"/>
          <Button title="Two"/>
        </ButtonGroup>
        <Segment appearance="attached"><p>Segment Content Here</p></Segment>
        <ButtonGroup attached="bottom">
          <Button title="One"/>
          <Button title="Two"/>
        </ButtonGroup>


        <Spacer size="massive" />
      </Container>
    );
  }
}

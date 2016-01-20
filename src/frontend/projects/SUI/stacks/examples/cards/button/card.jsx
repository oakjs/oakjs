"use strict";
import React from "react";
import oak, { Card } from "oak";

// just use project components
import components from "projects/SUI/components";

export default class ButtonCard extends Card {
	static defaultProps = {
		id: "button",
		title: "<Button> Examples"
	};

  // Remember imported components
  static components = components;

  renderChildren() {
    const { Button, ButtonGroup, Container, Conditional, Icon, Message, Segment, Spacer } = this.components;
    return (
      <Container>
        <h1>&lt;Button&gt; Tests</h1>

        <Segment appearance="inverted">
          <h2>Content</h2>
        </Segment>

        <h3>Inline or Attribute Content</h3>
        <Button title="Button with Title Attribute"/>
        <Button icon="checkmark" title="Button with Title and Icon Attributes"/>
        <Spacer/>
        <Button>Button With Inline Text</Button>
        <Button><Icon icon="checkmark"/>Button With Inline Text and Icon</Button>

        <h3>Icon</h3>
        <Button icon="cloud"/>

        <h3>Icon + Text</h3>
        <Button icon="cloud" title="Upload to Cloud"/>

        <h3>Labeled Icon</h3>
        <Button icon="pause" title="Pause" appearance="labeled icon"/>
        <Button icon="right arrow" appearance="right labeled icon">Next</Button>

        <h3>Labeled</h3>
        <Button icon="heart" label="1000">Like</Button>
        <Button icon="fork" label="1000" labelDirection="left"/>
        <Button title="Like" icon="heart" label="1000" labelDirection="left" labelAppearance="basic right pointing"/>
        <Spacer/>
        <Button icon="heart" label="1000" color="red" labelAppearance="basic left pointing">Like</Button>
        <Button icon="fork" label="1000" appearance="basic" color="blue" labelAppearance="basic left pointing">Forks</Button>


        <Spacer height={30}/>
        <Segment appearance="inverted">
          <h2>Appearance</h2>
        </Segment>

        <h3>Emphasis</h3>
        <Button>Normal</Button>
        <Button color="primary">Primary</Button>
        <Button color="secondary">Secondary</Button>
        <Button color="positive">Positive</Button>
        <Button color="negative">Negative</Button>

        <h3>Color</h3>
        <Button color="red" title="Red"/>
        <Button color="orange" title="Orange"/>
        <Button color="yellow" title="Yellow"/>
        <Button color="olive" title="Olive"/>
        <Button color="green" title="Green"/>
        <Button color="teal" title="Teal"/>
        <Button color="blue" title="Blue"/>
        <Spacer/>
        <Button color="violet" title="Violet"/>
        <Button color="purple" title="Purple"/>
        <Button color="pink" title="Pink"/>
        <Button color="brown" title="Brown"/>
        <Button color="grey" title="Grey"/>
        <Button color="black" title="Black"/>

        <h3>Basic</h3>
        <Button appearance="basic" icon="user">Add</Button>
        <Button appearance="basic" color="red" title="Red"/>
        <Button appearance="basic" color="orange" title="Orange"/>
        <Button appearance="basic" color="yellow" title="Yellow"/>
        <Button appearance="basic" color="olive" title="Olive"/>
        <Button appearance="basic" color="green" title="Green"/>
        <Button appearance="basic" color="teal" title="Teal"/>
        <Spacer/>
        <Button appearance="basic" color="blue" title="Blue"/>
        <Button appearance="basic" color="violet" title="Violet"/>
        <Button appearance="basic" color="purple" title="Purple"/>
        <Button appearance="basic" color="pink" title="Pink"/>
        <Button appearance="basic" color="brown" title="Brown"/>
        <Button appearance="basic" color="grey" title="Grey"/>
        <Button appearance="basic" color="black" title="Black"/>

        <h3>Inverted</h3>
        <Segment appearance="inverted">
          <Button appearance="inverted" icon="user">Add</Button>
          <Button appearance="inverted" color="red" title="Red"/>
          <Button appearance="inverted" color="orange" title="Orange"/>
          <Button appearance="inverted" color="yellow" title="Yellow"/>
          <Button appearance="inverted" color="olive" title="Olive"/>
          <Button appearance="inverted" color="green" title="Green"/>
          <Button appearance="inverted" color="teal" title="Teal"/>
          <Spacer/>
          <Button appearance="inverted" color="blue" title="Blue"/>
          <Button appearance="inverted" color="violet" title="Violet"/>
          <Button appearance="inverted" color="purple" title="Purple"/>
          <Button appearance="inverted" color="pink" title="Pink"/>
          <Button appearance="inverted" color="brown" title="Brown"/>
          <Button appearance="inverted" color="grey" title="Grey"/>
          <Button appearance="inverted" color="black" title="Black"/>
        </Segment>

        <Segment appearance="inverted">
          <Button appearance="inverted basic" icon="user">Add</Button>
          <Button appearance="inverted basic" color="red" title="Basic Red"/>
          <Button appearance="inverted basic" color="orange" title="Basic Orange"/>
          <Button appearance="inverted basic" color="yellow" title="Basic Yellow"/>
          <Button appearance="inverted basic" color="olive" title="Basic Olive"/>
          <Button appearance="inverted basic" color="green" title="Basic Green"/>
          <Button appearance="inverted basic" color="teal" title="Basic Teal"/>
          <Spacer/>
          <Button appearance="inverted basic" color="blue" title="Basic Blue"/>
          <Button appearance="inverted basic" color="violet" title="Basic Violet"/>
          <Button appearance="inverted basic" color="purple" title="Basic Purple"/>
          <Button appearance="inverted basic" color="pink" title="Basic Pink"/>
          <Button appearance="inverted basic" color="brown" title="Basic Brown"/>
          <Button appearance="inverted basic" color="grey" title="Basic Grey"/>
          <Button appearance="inverted basic" color="black" title="Basic Black"/>
        </Segment>

        <h3>Social</h3>
        <Button appearance="facebook" icon="facebook" title="Facebook"/>
        <Button appearance="twitter" icon="twitter" title="Twitter"/>
        <Button appearance="google plus" icon="google plus" title="Google Plus"/>
        <Button appearance="vk" icon="vk" title="VKk"/>
        <Button appearance="linkedin" icon="linkedin" title="LinkedIn"/>
        <Button appearance="instagram" icon="instagram" title="Instagram"/>
        <Button appearance="youtube" icon="youtube" title="YouTube"/>

        <h3>Size</h3>
        <Button size="mini" title="Mini"/>
        <Button size="tiny" title="Tiny"/>
        <Button size="small" title="Small"/>
        <Button size="medium" title="Medium"/>
        <Button size="large" title="Large"/>
        <Button size="big" title="Big"/>
        <Button size="huge" title="Huge"/>
        <Button size="massive" title="Massive"/>

        <h3>Floated</h3>
        <Segment clearing>
          <Button float="left" title="Left Floated"/>
          <Button float="right" title="Right Floated"/>
        </Segment>

        <h3>Compact</h3>
        <Button compact title="Hold"/>
        <Button compact icon="pause"/>
        <Button compact icon="pause" title="Pause" appearance="labeled icon"/>

        <h3>Toggle</h3>
        <Button toggle title="Vote"/>
        <Message appearance="error" message="TODO: `toggle` is not working."/>

        <h3>Fluid</h3>
        <Segment>
          <Button appearance="fluid" title="Fits container"/>
        </Segment>

        <h3>Circular</h3>
        <Button circular icon="settings"/>
        <Button circular appearance="facebook" icon="facebook"/>
        <Button circular appearance="twitter" icon="twitter"/>
        <Button circular appearance="linkedin" icon="linkedin"/>
        <Button circular appearance="google plus" icon="google plus"/>

        <h3>Vertically Attached</h3>
        <Button attached="top" title="Top"/>
        <Segment appearance="attached"><p>Segment Content Here</p></Segment>
        <Button attached="bottom" title="Bottom"/>

        <h3>Horizontally Attached</h3>
        <Button attached="left" title="Left"/>
        <Button attached="right" title="Right"/>


        <Spacer height={30}/>
        <Segment appearance="inverted">
          <h2>States</h2>
        </Segment>

        <h3>Active</h3>
        <Button active icon="user" title="Follow"/>

        <h3>Disabled</h3>
        <Button disabled icon="user" title="Follow"/>

        <h3>Loading</h3>
        <Button loading title="Loading"/>
        <Button loading appearance="basic" title="Loading"/>
        <Button loading color="primary" title="Loading"/>
        <Button loading color="secondary" title="Loading"/>

        <h3>Animated</h3>
        <Button appearance="animated">
          <div className="visible content">Horizontal</div>
          <div className="hidden content"><Icon icon="right arrow"/></div>
        </Button>
        <Button appearance="vertical animated">
          <div className="visible content">Vertical</div>
          <div className="hidden content"><Icon icon="right arrow"/></div>
        </Button>
        <Button appearance="animated fade">
          <div className="visible content">Fade</div>
          <div className="hidden content"><Icon icon="right arrow"/></div>
        </Button>


        <Spacer height={50}/>
      </Container>
    );
  }
}

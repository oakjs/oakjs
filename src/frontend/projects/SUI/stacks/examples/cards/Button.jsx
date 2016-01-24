"use strict";
import React from "react";
import { Card } from "oak";

export default class ButtonCard extends Card {
  static defaultProps = {
    id: "Button",
    title: "Button"
  }
  render() {
    const c = this.components;
    return (
      <div {...this.renderProps}>
        <c.PageSidebar/>
        <c.Page>
          <c.PageTitle title="Button">
            A button indicates a possible user action.
          </c.PageTitle>

          <c.PageSection title="Content">
            <c.Example title="Inline or Attribute Content">
              <c.Button title="Button with Title Attribute"/>
              <c.Button icon="checkmark" title="Button with Title and Icon Attributes"/>
              <c.Spacer/>
              <c.Button>Button With Inline Text</c.Button>
              <c.Button><c.Icon icon="checkmark"/>Button With Inline Text and Icon</c.Button>
            </c.Example>

            <c.Example title="Icon" hint="<Button icon='name'/>">
              <c.Button icon="cloud"/>
            </c.Example>

            <c.Example title="Icon + Text">
              <c.Button icon="cloud" title="Upload to Cloud"/>
            </c.Example>

            <c.Example title="Labeled Icon">
              <c.Button icon="pause" title="Pause" appearance="labeled icon"/>
              <c.Button icon="right arrow" appearance="right labeled icon">Next</c.Button>
            </c.Example>

            <c.Example title="Labeled">
              <c.Button icon="heart" label="1000">Like</c.Button>
              <c.Button icon="fork" label="1000" labelDirection="left"/>
              <c.Button title="Like" icon="heart" label="1000" labelDirection="left" labelAppearance="basic right pointing"/>
              <c.Spacer/>
              <c.Button icon="heart" label="1000" color="red" labelAppearance="basic left pointing">Like</c.Button>
              <c.Button icon="fork" label="1000" appearance="basic" color="blue" labelAppearance="basic left pointing">Forks</c.Button>
            </c.Example>
          </c.PageSection>

          <c.PageSection title="Appearance">

            <c.Example title="Emphasis">
              <c.Button>Normal</c.Button>
              <c.Button color="primary">Primary</c.Button>
              <c.Button color="secondary">Secondary</c.Button>
              <c.Button color="positive">Positive</c.Button>
              <c.Button color="negative">Negative</c.Button>
            </c.Example>

            <c.Example title="Color">
              <c.Button color="red" title="Red"/>
              <c.Button color="orange" title="Orange"/>
              <c.Button color="yellow" title="Yellow"/>
              <c.Button color="olive" title="Olive"/>
              <c.Button color="green" title="Green"/>
              <c.Button color="teal" title="Teal"/>
              <c.Button color="blue" title="Blue"/>
              <c.Spacer/>
              <c.Button color="violet" title="Violet"/>
              <c.Button color="purple" title="Purple"/>
              <c.Button color="pink" title="Pink"/>
              <c.Button color="brown" title="Brown"/>
              <c.Button color="grey" title="Grey"/>
              <c.Button color="black" title="Black"/>
            </c.Example>

            <c.Example title="Basic">
              <c.Button appearance="basic" icon="user">Add</c.Button>
              <c.Button appearance="basic" color="red" title="Red"/>
              <c.Button appearance="basic" color="orange" title="Orange"/>
              <c.Button appearance="basic" color="yellow" title="Yellow"/>
              <c.Button appearance="basic" color="olive" title="Olive"/>
              <c.Button appearance="basic" color="green" title="Green"/>
              <c.Button appearance="basic" color="teal" title="Teal"/>
              <c.Spacer/>
              <c.Button appearance="basic" color="blue" title="Blue"/>
              <c.Button appearance="basic" color="violet" title="Violet"/>
              <c.Button appearance="basic" color="purple" title="Purple"/>
              <c.Button appearance="basic" color="pink" title="Pink"/>
              <c.Button appearance="basic" color="brown" title="Brown"/>
              <c.Button appearance="basic" color="grey" title="Grey"/>
              <c.Button appearance="basic" color="black" title="Black"/>
            </c.Example>

            <c.Example title="Inverted">
              <c.Segment appearance="inverted">
                <c.Button appearance="inverted" icon="user">Add</c.Button>
                <c.Button appearance="inverted" color="red" title="Red"/>
                <c.Button appearance="inverted" color="orange" title="Orange"/>
                <c.Button appearance="inverted" color="yellow" title="Yellow"/>
                <c.Button appearance="inverted" color="olive" title="Olive"/>
                <c.Button appearance="inverted" color="green" title="Green"/>
                <c.Button appearance="inverted" color="teal" title="Teal"/>
                <c.Spacer/>
                <c.Button appearance="inverted" color="blue" title="Blue"/>
                <c.Button appearance="inverted" color="violet" title="Violet"/>
                <c.Button appearance="inverted" color="purple" title="Purple"/>
                <c.Button appearance="inverted" color="pink" title="Pink"/>
                <c.Button appearance="inverted" color="brown" title="Brown"/>
                <c.Button appearance="inverted" color="grey" title="Grey"/>
                <c.Button appearance="inverted" color="black" title="Black"/>
              </c.Segment>

              <c.Segment appearance="inverted">
                <c.Button appearance="inverted basic" icon="user">Add</c.Button>
                <c.Button appearance="inverted basic" color="red" title="Basic Red"/>
                <c.Button appearance="inverted basic" color="orange" title="Basic Orange"/>
                <c.Button appearance="inverted basic" color="yellow" title="Basic Yellow"/>
                <c.Button appearance="inverted basic" color="olive" title="Basic Olive"/>
                <c.Button appearance="inverted basic" color="green" title="Basic Green"/>
                <c.Button appearance="inverted basic" color="teal" title="Basic Teal"/>
                <c.Spacer/>
                <c.Button appearance="inverted basic" color="blue" title="Basic Blue"/>
                <c.Button appearance="inverted basic" color="violet" title="Basic Violet"/>
                <c.Button appearance="inverted basic" color="purple" title="Basic Purple"/>
                <c.Button appearance="inverted basic" color="pink" title="Basic Pink"/>
                <c.Button appearance="inverted basic" color="brown" title="Basic Brown"/>
                <c.Button appearance="inverted basic" color="grey" title="Basic Grey"/>
                <c.Button appearance="inverted basic" color="black" title="Basic Black"/>
              </c.Segment>
            </c.Example>

            <c.Example title="Social">
              <c.Button appearance="facebook" icon="facebook" title="Facebook"/>
              <c.Button appearance="twitter" icon="twitter" title="Twitter"/>
              <c.Button appearance="google plus" icon="google plus" title="Google Plus"/>
              <c.Button appearance="vk" icon="vk" title="VKk"/>
              <c.Button appearance="linkedin" icon="linkedin" title="LinkedIn"/>
              <c.Button appearance="instagram" icon="instagram" title="Instagram"/>
              <c.Button appearance="youtube" icon="youtube" title="YouTube"/>
            </c.Example>

            <c.Example title="Size">
              <c.Button size="mini" title="Mini"/>
              <c.Button size="tiny" title="Tiny"/>
              <c.Button size="small" title="Small"/>
              <c.Button size="medium" title="Medium"/>
              <c.Button size="large" title="Large"/>
              <c.Button size="big" title="Big"/>
              <c.Button size="huge" title="Huge"/>
              <c.Button size="massive" title="Massive"/>
            </c.Example>

            <c.Example title="Floated">
              <c.Segment clearing>
                <c.Button float="left" title="Left Floated"/>
                <c.Button float="right" title="Right Floated"/>
              </c.Segment>
            </c.Example>

            <c.Example title="Compact">
              <c.Button compact title="Hold"/>
              <c.Button compact icon="pause"/>
              <c.Button compact icon="pause" title="Pause" appearance="labeled icon"/>
            </c.Example>

            <c.Example title="Toggle">
              <c.Button toggle title="Vote"/>
              <c.Message appearance="error" message="TODO: `toggle` is not working."/>
            </c.Example>

            <c.Example title="Fluid">
              <c.Segment>
                <c.Button appearance="fluid" title="Fits container"/>
              </c.Segment>
            </c.Example>

            <c.Example title="Circular">
              <c.Button circular icon="settings"/>
              <c.Button circular appearance="facebook" icon="facebook"/>
              <c.Button circular appearance="twitter" icon="twitter"/>
              <c.Button circular appearance="linkedin" icon="linkedin"/>
              <c.Button circular appearance="google plus" icon="google plus"/>
            </c.Example>

            <c.Example title="Vertically Attached">
              <c.Button attached="top" title="Top"/>
              <c.Segment appearance="attached"><p>Segment Content Here</p></c.Segment>
              <c.Button attached="bottom" title="Bottom"/>
            </c.Example>

            <c.Example title="Horizontally Attached">
              <c.Button attached="left" title="Left"/>
              <c.Button attached="right" title="Right"/>
            </c.Example>
          </c.PageSection>

          <c.PageSection title="States">
            <c.Example title="Active">
              <c.Button active icon="user" title="Follow"/>
            </c.Example>

            <c.Example title="Disabled">
              <c.Button disabled icon="user" title="Follow"/>
            </c.Example>

            <c.Example title="Loading">
              <c.Button loading title="Loading"/>
              <c.Button loading appearance="basic" title="Loading"/>
              <c.Button loading color="primary" title="Loading"/>
              <c.Button loading color="secondary" title="Loading"/>
            </c.Example>

            <c.Example title="Animated">
              <c.Button appearance="animated">
                <div className="visible content">Horizontal</div>
                <div className="hidden content"><c.Icon icon="right arrow"/></div>
              </c.Button>
              <c.Button appearance="vertical animated">
                <div className="visible content">Vertical</div>
                <div className="hidden content"><c.Icon icon="right arrow"/></div>
              </c.Button>
              <c.Button appearance="animated fade">
                <div className="visible content">Fade</div>
                <div className="hidden content"><c.Icon icon="right arrow"/></div>
              </c.Button>
            </c.Example>
          </c.PageSection>

        </c.Page>
      </div>
    );
  }
}

window.ButtonCard = ButtonCard;

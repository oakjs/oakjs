"use strict";
import React from "react";
import { Card } from "oak";

export default class LabelCard extends Card {
  static defaultProps = {
    id: "Label",
    title: "Label"
  }

  static data = {
    joeAvatar: "http://semantic-ui.com/images/avatar/large/joe.jpg",
    elliotAvatar: "http://semantic-ui.com/images/avatar/large/elliot.jpg",
    stevieAvatar: "http://semantic-ui.com/images/avatar/large/stevie.jpg",
    placeholderImage: "http://semantic-ui.com/images/wireframe/image.png",
    onClosed: function(who){ alert(`Closed ${who}.`) }
  }

  render() {
    const c = this.components;
    //TODO: this should be dynamic...
    const data = this.constructor.data;
    return (
      <div {...this.renderProps}>
        <c.PageSidebar/>
        <c.Page>
          <c.PageTitle title="Label">
            A label displays content classification
          </c.PageTitle>

          <c.PageSection title="Content">

            <c.Example title="Text">
              <c.Label content="Label with content attribute"/>
              <c.Label>Label with inline content</c.Label>
            </c.Example>

            <c.Example title="Icon">
              <c.Label icon="mail" content="Label with content and icon attributes"/>
              <c.Label icon="mail" iconOn="right" content="Label with content and icon attributes"/>
              <c.Spacer/>
              <c.Label><c.Icon icon="mail"/>Label with inline content and icon</c.Label>
              <c.Label appearance="right icon">Label with inline content and icon<c.Icon icon="mail"/></c.Label>
            </c.Example>

            <c.Example title="Detail">
              <c.Label content="Label with content and detail attributes" detail="Detail here"/>
              <c.Label>Label with inline content and detail<div className="detail">Detail here</div></c.Label>

              <c.Spacer/>
              <c.Label icon="mail" content="Label with detail and icon" detail="Detail here"/>
              <c.Label icon="mail" iconOn="right" content="Label with detail and icon" detail="Detail here"/>

              <c.Spacer/>
              <c.Label closable content="Closable label with detail and icon" detail="Detail here"/>
            </c.Example>


            <c.Example title="Image" hint="<Label image='http://...'/>">
              <c.Label image={data.joeAvatar}>Joe</c.Label>
              <c.Label image={data.elliotAvatar}>Elliot</c.Label>
              <c.Label image={data.stevieAvatar}>Stevie</c.Label>

              <c.Spacer/>
              <c.Label image={data.joeAvatar} imageOn="right">Joe</c.Label>
              <c.Label image={data.elliotAvatar} imageOn="right">Elliot</c.Label>
              <c.Label image={data.stevieAvatar} imageOn="right">Stevie</c.Label>

              <c.Spacer/>
              <c.Label color="yellow" image={data.joeAvatar}>Joe</c.Label>
              <c.Label color="teal" image={data.elliotAvatar}>Elliot<div className="detail">Professor</div></c.Label>
            </c.Example>

            <c.Example title="Including image" hint="<Label><Image src='http://...'/></Label>">
              <c.Label><c.Image src={data.joeAvatar} size="tiny"/>Joe</c.Label>
              <c.Label><c.Image src={data.elliotAvatar} size="tiny"/>Elliot</c.Label>
              <c.Label><c.Image src={data.stevieAvatar} size="tiny"/>Stevie</c.Label>

              <c.Spacer/>
              <c.Label><c.Image src={data.joeAvatar} appearance="avatar" size="tiny"/>Joe</c.Label>
              <c.Label><c.Image src={data.elliotAvatar} appearance="avatar" size="tiny"/>Elliot</c.Label>
              <c.Label><c.Image src={data.stevieAvatar} appearance="avatar" size="tiny"/>Stevie</c.Label>
            </c.Example>

            <c.Example title="Link" hint="<Label tagName='a'.../>">
              <c.Label tagName="a" content="Google" icon="google" href="http://google.com" target="_blank"/>
            </c.Example>

          </c.PageSection>


          <c.PageSection title="Appearance">

            <c.Example title="Basic" hint="<Label appearance='basic'/>">
              <c.Label appearance="basic">Basic</c.Label>
              <c.Label appearance="basic" image={data.elliotAvatar} size="small">Elliot</c.Label>
              <c.Label appearance="basic" pointing>Pointing</c.Label>
              <c.Label appearance="basic" pointing="down" color="red">Red Pointing</c.Label>
              <c.Label appearance="basic" color="blue">Blue</c.Label>
            </c.Example>

            <c.Example title="Transparent" hint="<Label appearance='transparent'/>">
              <c.Message color="red">TODO: Transparent colors would be cool...</c.Message>
                <c.Label appearance="transparent">transparent</c.Label>
                <c.Label appearance="transparent baisc">transparent basic</c.Label>
                <c.Label appearance="transparent" image={data.elliotAvatar} size="small">Elliot</c.Label>
                <c.Label appearance="transparent" pointing>Pointing</c.Label>
                <c.Label appearance="transparent" pointing="down" color="red">Red Pointing</c.Label>
                <c.Label appearance="transparent" color="blue">Blue</c.Label>
            </c.Example>

            <c.Example title="Inverted" hint="<Label appearance='inverted'/>">
              <c.Message color="red">TODO: SUI doesn't seem to support this unless you specify a color...</c.Message>
              <c.Segment appearance="inverted">
                <c.Label appearance="inverted">inverted</c.Label>
                <c.Label appearance="inverted baisc">inverted basic</c.Label>
                <c.Label appearance="inverted" image={data.elliotAvatar} size="small">Elliot</c.Label>
                <c.Label appearance="inverted" pointing>Pointing</c.Label>
                <c.Label appearance="inverted" pointing="down" color="red">Red Pointing</c.Label>
                <c.Label appearance="inverted" color="blue">Blue</c.Label>
              </c.Segment>
            </c.Example>

            <c.Example title="Colors" hint="<Label appearance='circular'/>">
              <c.Label>(no color)</c.Label>
              <c.Label color="red">red</c.Label>
              <c.Label color="orange">orange</c.Label>
              <c.Label color="yellow">yellow</c.Label>
              <c.Label color="olive">olive</c.Label>
              <c.Label color="green">green</c.Label>
              <c.Label color="teal">teal</c.Label>
              <c.Label color="blue">blue</c.Label>
              <c.Label color="violet">violet</c.Label>
              <c.Label color="purple">purple</c.Label>
              <c.Label color="pink">pink</c.Label>
              <c.Label color="brown">brown</c.Label>
              <c.Label color="grey">grey</c.Label>
              <c.Label color="black">black</c.Label>
            </c.Example>



            <c.Example title="Pointing" hint="<Label pointing/> or <Label pointing='right'/>">
              <c.Grid columns={2}>
                <c.Column>
                  <c.Input appearance="fluid" placeholder="First name"/>
                  <c.Label pointing>Please enter a value</c.Label>
                </c.Column>

                <c.Column>
                  <c.Label pointing="down">Please enter a value</c.Label>
                  <c.Input appearance="fluid" placeholder="First name"/>
                </c.Column>

                <c.Column>
                  <c.Label pointing="right" color="red" appearance="basic">6 characters or more</c.Label>
                  <c.Input type="password" value="xxx" error/>
                </c.Column>

                <c.Column>
                  <c.Input placeholder="Username"/>
                  <c.Label pointing="left" color="red">That name is taken.</c.Label>
                </c.Column>
              </c.Grid>
            </c.Example>

            <c.Example title="Corner" hint="<Label appearance='left corner'/>">
              <c.Grid columns={3}>
                <c.Column>
                  <c.Image src={data.placeholderImage} appearance="fluid">
                    <c.Label appearance="corner" icon='heart'/>
                  </c.Image>
                </c.Column>
                <c.Column>
                  <c.Image src={data.placeholderImage} appearance="fluid">
                    <c.Label appearance="left corner" icon='heart'/>
                  </c.Image>
                </c.Column>
                <c.Column>
                  <c.Image src={data.placeholderImage} appearance="fluid">
                    <c.Label appearance="right corner" icon='heart'/>
                  </c.Image>
                </c.Column>
              </c.Grid>
            </c.Example>

            <c.Example title="Tag" hint="<Label appearance='tag'/>">
              <c.Label appearance="tag">New</c.Label>
              <c.Label appearance="tag" color="red">Upcoming</c.Label>
              <c.Label appearance="tag" color="teal">Featured</c.Label>
            </c.Example>

            <c.Example title="Ribbon" hint="<Label appearance='ribbon'/>">
              <c.Grid columns={2}>
                <c.Column>
                  <c.Segment appearance="raised">
                    <c.Label appearance="ribbon">Overview</c.Label>
                    <span>Account Details</span>
                    <c.LoremIpsum short/>
                    <c.Spacer/>
                    <c.Label appearance="ribbon" color="red">Community</c.Label>
                    <span>User Reviews</span>
                    <c.LoremIpsum short/>
                  </c.Segment>
                </c.Column>

                <c.Column>
                  <c.Segment appearance="raised">
                    <c.Label appearance="right ribbon" color="orange">Specs</c.Label>
                    <c.LoremIpsum short/>
                    <c.Spacer/>
                    <c.Label appearance="right ribbon" color="teal">Reviews</c.Label>
                    <c.LoremIpsum short/>
                  </c.Segment>
                </c.Column>

                <c.Column>
                  <c.Image src={data.placeholderImage} appearance="fluid">
                    <c.Label appearance="black ribbon" icon='hotel'>Hotel</c.Label>
                  </c.Image>
                </c.Column>

                <c.Column>
                  <c.Image src={data.placeholderImage} appearance="fluid">
                    <c.Label appearance="right ribbon" color="red" icon='food'>Food</c.Label>
                  </c.Image>
                </c.Column>

              </c.Grid>
            </c.Example>


            <c.Example title="Attached" hint="<Label appearance='top attached'/>">
              <c.Grid columns={3}>
                <c.Column>
                  <c.Segment>
                    <c.Label appearance="top left attached">top right</c.Label>
                    <c.LoremIpsum tiny/>
                  </c.Segment>
                </c.Column>

                <c.Column>
                  <c.Segment>
                    <c.Label appearance="top attached">top attached</c.Label>
                    <c.LoremIpsum tiny/>
                  </c.Segment>
                </c.Column>

                <c.Column>
                  <c.Segment>
                    <c.Label appearance="top right attached">top right</c.Label>
                    <c.LoremIpsum tiny/>
                  </c.Segment>
                </c.Column>

                <c.Column>
                  <c.Segment>
                    <c.Label appearance="bottom left attached">bottom right</c.Label>
                    <c.LoremIpsum tiny/>
                  </c.Segment>
                </c.Column>

                <c.Column>
                  <c.Segment>
                    <c.Label appearance="bottom attached">bottom attached</c.Label>
                    <c.LoremIpsum tiny/>
                  </c.Segment>
                </c.Column>

                <c.Column>
                  <c.Segment>
                    <c.Label appearance="bottom right attached">bottom right</c.Label>
                    <c.LoremIpsum tiny/>
                  </c.Segment>
                </c.Column>

              </c.Grid>
            </c.Example>

            <c.Example title="Horizontal" hint="<Label appearance='horizontal'/>">
              <c.Message color="red">TODO: refactor this to a &lt;List&gt;</c.Message>
              <div className="ui divided section list">
                <div className="item">
                  <c.Label appearance="horizontal" color="red">Fruit</c.Label>
                  Kumquats
                </div>
                <div className="item">
                  <c.Label appearance="horizontal" color="purple">Candy</c.Label>
                  Ice Cream
                </div>
                <div className="item">
                  <c.Label appearance="horizontal" color="red">Fruit</c.Label>
                  Orange
                </div>
              </div>
            </c.Example>

            <c.Example title="Floating" hint="<Label floating/>">
              <c.Menu appearance="compact">
                <c.MenuItem icon="mail" label="Messages">
                  <c.Label floating color="red">22</c.Label>
                </c.MenuItem>
                <c.MenuItem icon="users" label="Friends">
                  <c.Label floating color="teal">3</c.Label>
                </c.MenuItem>
              </c.Menu>
            </c.Example>

            <c.Example title="Closable" hint="<Label closable onClose='...'/>">
              <c.Label closable onClose={data.onClosed.bind(undefined, "Joe")}>Joe</c.Label>
              <c.Label closable onClose={data.onClosed.bind(undefined, "Elliot")}>Elliot</c.Label>
              <c.Label closable onClose={data.onClosed.bind(undefined, "Stevie")}>Stevie</c.Label>
              <c.Spacer/>

              <c.Label closable onClose={data.onClosed.bind(undefined, "Joe")} icon="mail">Joe</c.Label>
              <c.Label closable onClose={data.onClosed.bind(undefined, "Elliot")} icon="mail">Elliot</c.Label>
              <c.Label closable onClose={data.onClosed.bind(undefined, "Stevie")} icon="mail">Stevie</c.Label>
              <c.Spacer/>

              <c.Label closable onClose={data.onClosed.bind(undefined, "Joe")} image={data.joeAvatar}>Joe</c.Label>
              <c.Label closable onClose={data.onClosed.bind(undefined, "Elliot")} image={data.elliotAvatar}>Elliot</c.Label>
              <c.Label closable onClose={data.onClosed.bind(undefined, "Stevie")} image={data.stevieAvatar}>Stevie</c.Label>
            </c.Example>


            <c.Example title="Circular" hint="<Label appearance='circular'/>">
              <c.Label appearance="circular">2</c.Label>
              <c.Label color="red" appearance="circular">2</c.Label>
              <c.Label color="orange" appearance="circular">2</c.Label>
              <c.Label color="yellow" appearance="circular">2</c.Label>
              <c.Label color="olive" appearance="circular">2</c.Label>
              <c.Label color="green" appearance="circular">2</c.Label>
              <c.Label color="teal" appearance="circular">2</c.Label>
              <c.Label color="blue" appearance="circular">2</c.Label>
              <c.Label color="violet" appearance="circular">2</c.Label>
              <c.Label color="purple" appearance="circular">2</c.Label>
              <c.Label color="pink" appearance="circular">2</c.Label>
              <c.Label color="brown" appearance="circular">2</c.Label>
              <c.Label color="grey" appearance="circular">2</c.Label>
              <c.Label color="black" appearance="circular">2</c.Label>

              <c.Spacer/>
              <c.Label appearance="circular">200</c.Label>
              <c.Label appearance="circular" color='teal'>2,000</c.Label>
              <c.Label appearance="circular" color='blue'>2,000,000</c.Label>
            </c.Example>

            <c.Example title="Dots (empty circular)" hint="<Label appearance='empty circular'/>">
              <c.Label appearance="empty circular"></c.Label>
              <c.Label color="red" appearance="empty circular"></c.Label>
              <c.Label color="orange" appearance="empty circular"></c.Label>
              <c.Label color="yellow" appearance="empty circular"></c.Label>
              <c.Label color="olive" appearance="empty circular"></c.Label>
              <c.Label color="green" appearance="empty circular"></c.Label>
              <c.Label color="teal" appearance="empty circular"></c.Label>
              <c.Label color="blue" appearance="empty circular"></c.Label>
              <c.Label color="violet" appearance="empty circular"></c.Label>
              <c.Label color="purple" appearance="empty circular"></c.Label>
              <c.Label color="pink" appearance="empty circular"></c.Label>
              <c.Label color="brown" appearance="empty circular"></c.Label>
              <c.Label color="grey" appearance="empty circular"></c.Label>
              <c.Label color="black" appearance="empty circular"></c.Label>
            </c.Example>

            <c.Example title="Sizes" hint="<Label size='large'/>">
              <c.Label size="mini">mini</c.Label>
              <c.Label size="mini" icon="mail">icon</c.Label>
              <c.Label size="mini" icon="mail" iconOn="right">icon</c.Label>
              <c.Label size="mini" image={data.joeAvatar}>image</c.Label>
              <c.Label size="mini" image={data.joeAvatar} imageOn="right">image</c.Label>

              <c.Spacer/>
              <c.Label size="tiny">tiny</c.Label>
              <c.Label size="tiny" icon="mail">icon</c.Label>
              <c.Label size="tiny" icon="mail" iconOn="right">icon</c.Label>
              <c.Label size="tiny" image={data.joeAvatar}>image</c.Label>
              <c.Label size="tiny" image={data.joeAvatar} imageOn="right">image</c.Label>

              <c.Spacer/>
              <c.Label size="small">small</c.Label>
              <c.Label size="small" icon="mail">icon</c.Label>
              <c.Label size="small" icon="mail" iconOn="right">icon</c.Label>
              <c.Label size="small" image={data.joeAvatar}>image</c.Label>
              <c.Label size="small" image={data.joeAvatar} imageOn="right">image</c.Label>

              <c.Spacer/>
              <c.Label size="medium">medium</c.Label>
              <c.Label size="medium" icon="mail">icon</c.Label>
              <c.Label size="medium" icon="mail" iconOn="right">icon</c.Label>
              <c.Label size="medium" image={data.joeAvatar}>image</c.Label>
              <c.Label size="medium" image={data.joeAvatar} imageOn="right">image</c.Label>

              <c.Spacer/>
              <c.Label size="large">large</c.Label>
              <c.Label size="large" icon="mail">icon</c.Label>
              <c.Label size="large" icon="mail" iconOn="right">icon</c.Label>
              <c.Label size="large" image={data.joeAvatar}>image</c.Label>
              <c.Label size="large" image={data.joeAvatar} imageOn="right">image</c.Label>

              <c.Spacer/>
              <c.Label size="big">big</c.Label>
              <c.Label size="big" icon="mail">icon</c.Label>
              <c.Label size="big" icon="mail" iconOn="right">icon</c.Label>
              <c.Label size="big" image={data.joeAvatar}>image</c.Label>
              <c.Label size="big" image={data.joeAvatar} imageOn="right">image</c.Label>

              <c.Spacer/>
              <c.Label size="huge">huge</c.Label>
              <c.Label size="huge" icon="mail">icon</c.Label>
              <c.Label size="huge" icon="mail" iconOn="right">icon</c.Label>
              <c.Label size="huge" image={data.joeAvatar}>image</c.Label>
              <c.Label size="huge" image={data.joeAvatar} imageOn="right">image</c.Label>

              <c.Spacer/>
              <c.Label size="massive">massive</c.Label>
              <c.Label size="massive" icon="mail">icon</c.Label>
              <c.Label size="massive" icon="mail" iconOn="right">icon</c.Label>
              <c.Label size="massive" image={data.joeAvatar}>image</c.Label>
              <c.Label size="massive" image={data.joeAvatar} imageOn="right">image</c.Label>
            </c.Example>

          </c.PageSection>


          <c.PageSection title="States">
            <c.Example title="Hidden" hint="<Label hidden/>">
              <c.Label pointing="right">Hidden label here</c.Label>
              <c.Label hidden>You should not see me</c.Label>
              <c.Label pointing="left">Hidden label here</c.Label>
            </c.Example>

            <c.Example title="Disabled" hint="<Label disabled/>">
              <c.Label disabled>Normal</c.Label>
              <c.Label disabled image={data.elliotAvatar} size="small">Elliot</c.Label>
              <c.Label disabled pointing>Pointing</c.Label>
              <c.Label disabled pointing="down" color="red">Red Pointing</c.Label>
              <c.Label disabled color="blue">Blue</c.Label>
              <c.Spacer/>
              <c.Label disabled appearance="basic">Basic</c.Label>
              <c.Label disabled appearance="basic" image={data.elliotAvatar} size="small">Elliot</c.Label>
              <c.Label disabled appearance="basic" pointing>Pointing</c.Label>
              <c.Label disabled appearance="basic" pointing="down" color="red">Red Pointing</c.Label>
              <c.Label disabled appearance="basic" color="blue">Blue</c.Label>
              <c.Spacer/>
              <c.Label disabled appearance="transparent">transparent</c.Label>
              <c.Label disabled appearance="transparent" image={data.elliotAvatar} size="small">Elliot</c.Label>
              <c.Label disabled appearance="transparent" pointing>Pointing</c.Label>
              <c.Label disabled appearance="transparent" pointing="down" color="red">Red Pointing</c.Label>
              <c.Label disabled appearance="transparent" color="blue">Blue</c.Label>
            </c.Example>

            <c.Example title="Active" hint="<Label active/>">
              <c.Label active>Normal</c.Label>
              <c.Label active image={data.elliotAvatar} size="small">Elliot</c.Label>
              <c.Label active pointing>Pointing</c.Label>
              <c.Label active pointing="down" color="red">Red Pointing</c.Label>
              <c.Label active color="blue">Blue</c.Label>
            </c.Example>


          </c.PageSection>

        </c.Page>
      </div>
    );
  }
}

"use strict";
import React from "react";
import Card from "oak/Card";

export default class StatisticCard extends Card {
  static defaultProps = {
    id: "Statistic",
    title: "Statistic"
  }

  getInitialData() {
    return {
      joeAvatar: "http://semantic-ui.com/images/avatar/small/joe.jpg",
      elliotAvatar: "http://semantic-ui.com/images/avatar/small/elliot.jpg",
      stevieAvatar: "http://semantic-ui.com/images/avatar/small/stevie.jpg"
    };
  }

  // add render method so we get hot reload
  render() { return super.render() }

  // actual card render
  renderChildren({ data, card, stack, project, c }) {
    return (
      <c.CardContainer>
        <c.PageSidebar/>
        <c.Page>
          <c.PageTitle title="Statistic">
            A statistic emphasizes the current value of an attribute
            <c.Info>
              If you have multiple &lt;Statistic&gt;s in a row and they don't line up vertically,
              wrap them in a &lt;Statistics&gt; element.
            </c.Info>
          </c.PageTitle>

          <c.PageSection title="Content">

            <c.Example title="Inline content">
              <c.Statistics>
                <c.Statistic>
                  <div className="value">5,500</div>
                  <div className="label">Downloads</div>
                </c.Statistic>
                <c.Statistic>
                  <div className="text value">Three<br/>Thousand</div>
                  <div className="label">Downloads</div>
                </c.Statistic>
              </c.Statistics>
            </c.Example>

            <c.Example title="Value, and Label and LabelOn attributes" hint="<Statistic value='...' label='...' labelOn='top'/>">
              <c.Statistics>
                <c.Statistic value="5,500" label="Downloads"/>
                <c.Statistic labelOn='top' value="5,500" label="Downloads"/>
              </c.Statistics>
            </c.Example>

            <c.Example title="Icon attribute" hint="<Statistic icon='...' decorationOn='right'/>">
              <c.Statistic icon='world' value="500" label="Countries Represented"/>
              <c.Statistic icon='world' decorationOn='right' value="500" label="Countries Represented"/>
            </c.Example>

            <c.Example title="Image attribute" hint="<Statistic image='...' imageAppearance='...' decorationOn='right'/>">
              <c.Statistic image={data.joeAvatar} imageAppearance="ui circular inline image"  value="42" label="Team members"/>
              <c.Statistic image={data.joeAvatar} decorationOn='right' imageAppearance="ui circular inline image"  value="42" label="Team members"/>
            </c.Example>

          </c.PageSection>

          <c.PageSection title="Appearance">

            <c.Example title="Horizontal" hint="<Statistic appearance='horizontal'/>">
              <c.Statistic value="5,500" label="Downloads" appearance="horizontal"/>
              <c.Spacer/>
              <c.Statistic value="8,900" label="Signups" appearance="horizontal"/>
              <c.Spacer/>
              <c.Statistic value="10,400" label="Messages sent" appearance="horizontal"/>
            </c.Example>

            <c.Example title="Colored" hint="<Statistic color='red'/>">
              <c.Statistics columns={6}>
                <c.Statistic color="red" value="87" label="People like red"/>
                <c.Statistic color="orange" value="94" label="People like orange"/>
                <c.Statistic color="yellow" value="13" label="People like yellow"/>
                <c.Statistic color="olive" value="8" label="People like olive"/>
                <c.Statistic color="green" value="48" label="People like green"/>
                <c.Statistic color="teal" value="98" label="People like teal"/>
                <c.Statistic color="blue" value="34" label="People like blue"/>
                <c.Statistic color="violet" value="82" label="People like violet"/>
                <c.Statistic color="purple" value="100" label="People like purple"/>
                <c.Statistic color="pink" value="6" label="People like pink"/>
                <c.Statistic color="brown" value="42" label="People like brown"/>
                <c.Statistic color="grey" value="87" label="People like grey"/>
              </c.Statistics>
            </c.Example>

            <c.Example title="Inverted" hint="<Statistic appearance='inverted'/>">
              <c.Segment appearance="inverted">
                <c.Statistics columns={5}>
                  <c.Statistic appearance="inverted" value="93" label="inverted"/>
                  <c.Statistic appearance="inverted" color="red" value="87" label="inverted red"/>
                  <c.Statistic appearance="inverted" color="orange" value="94" label="inverted orange"/>
                  <c.Statistic appearance="inverted" color="yellow" value="13" label="inverted yellow"/>
                  <c.Statistic appearance="inverted" color="olive" value="8" label="inverted olive"/>
                  <c.Statistic appearance="inverted" color="green" value="48" label="inverted green"/>
                  <c.Statistic appearance="inverted" color="teal" value="98" label="inverted teal"/>
                  <c.Statistic appearance="inverted" color="blue" value="34" label="inverted blue"/>
                  <c.Statistic appearance="inverted" color="violet" value="82" label="inverted violet"/>
                  <c.Statistic appearance="inverted" color="purple" value="100" label="inverted purple"/>
                  <c.Statistic appearance="inverted" color="pink" value="6" label="inverted pink"/>
                  <c.Statistic appearance="inverted" color="brown" value="42" label="inverted brown"/>
                  <c.Statistic appearance="inverted" color="grey" value="87" label="inverted grey"/>
                </c.Statistics>
              </c.Segment>
            </c.Example>

            <c.Example title="Floated" hint="<Statistic floated='right'/>">
              <c.Statistic value="5,500" label="Downloads" floated="right"/>
              <c.LoremIpsum short/>
              <c.Spacer/>
              <c.Statistic value="5,500" label="Downloads" floated="left"/>
              <c.LoremIpsum/>
            </c.Example>

            <c.Example title="Sizes" hint="<Statistic size='mini'/>">
              <c.Grid columns={2}>
                <c.Column>
                  <c.Statistic size='mini' icon='unhide' value="503" label="mini"/>
                  <c.Spacer tiny/>
                  <c.Statistic size='tiny' icon='unhide' value="503" label="tiny"/>
                  <c.Spacer tiny/>
                  <c.Statistic size='small' icon='unhide' value="503" label="small"/>
                  <c.Spacer tiny/>
                  <c.Statistic size='medium' icon='unhide' value="503" label="medium"/>
                  <c.Spacer tiny/>
                  <c.Statistic size='large' icon='unhide' value="503" label="large"/>
                  <c.Spacer tiny/>
                  <c.Statistic size='huge' icon='unhide' value="503" label="huge"/>
                </c.Column>
                <c.Column>
                  <c.Statistic appearance="horizontal" size='mini' icon='unhide' value="503" label="mini"/>
                  <c.Spacer tiny/>
                  <c.Statistic appearance="horizontal" size='tiny' icon='unhide' value="503" label="tiny"/>
                  <c.Spacer tiny/>
                  <c.Statistic appearance="horizontal" size='small' icon='unhide' value="503" label="small"/>
                  <c.Spacer tiny/>
                  <c.Statistic appearance="horizontal" size='medium' icon='unhide' value="503" label="medium"/>
                  <c.Spacer tiny/>
                  <c.Statistic appearance="horizontal" size='large' icon='unhide' value="503" label="large"/>
                  <c.Spacer tiny/>
                  <c.Statistic appearance="horizontal" size='huge' icon='unhide' value="503" label="huge"/>
                </c.Column>
              </c.Grid>
            </c.Example>


          </c.PageSection>
        </c.Page>
      </c.CardContainer>
    );
  }
}

"use strict";
import React from "react";
import { Card } from "oak";

export default class GridCard extends Card {
  static defaultProps = {
    id: "Grid",
    title: "Grid"
  }
  // add render method so we get hot reload
  render() { return super.render() }

  // actual card render
  renderChildren({ data, card, stack, project, c }) {
    return (
      <c.CardContainer>
        <c.PageSidebar/>
        <c.Page>
          <c.PageTitle title="Grid">
            A grid is used to harmonize negative space in a layout
          </c.PageTitle>

          <c.PageSection title="Types">

            <c.Example title="Basic Grid">
              <c.Grid>
                <c.Column><c.Button appearance="fluid"/></c.Column>
                <c.Column><c.Button appearance="fluid"/></c.Column>
                <c.Column><c.Button appearance="fluid"/></c.Column>
                <c.Column><c.Button appearance="fluid"/></c.Column>
                <c.Column><c.Button appearance="fluid"/></c.Column>
                <c.Column><c.Button appearance="fluid"/></c.Column>
                <c.Column><c.Button appearance="fluid"/></c.Column>
                <c.Column><c.Button appearance="fluid"/></c.Column>
                <c.Column><c.Button appearance="fluid"/></c.Column>
                <c.Column><c.Button appearance="fluid"/></c.Column>
                <c.Column><c.Button appearance="fluid"/></c.Column>
                <c.Column><c.Button appearance="fluid"/></c.Column>
                <c.Column><c.Button appearance="fluid"/></c.Column>
                <c.Column><c.Button appearance="fluid"/></c.Column>
                <c.Column><c.Button appearance="fluid"/></c.Column>
                <c.Column><c.Button appearance="fluid"/></c.Column>
              </c.Grid>
            </c.Example>

            <c.Example title="Column Count" hint="<Grid columns={4}/>">
              <c.Grid columns={4}>
                <c.Column><c.Button appearance="fluid"/></c.Column>
                <c.Column><c.Button appearance="fluid"/></c.Column>
                <c.Column><c.Button appearance="fluid"/></c.Column>
                <c.Column><c.Button appearance="fluid"/></c.Column>
              </c.Grid>

              <c.Grid columns={7}>
                <c.Column><c.Button appearance="fluid"/></c.Column>
                <c.Column><c.Button appearance="fluid"/></c.Column>
                <c.Column><c.Button appearance="fluid"/></c.Column>
                <c.Column><c.Button appearance="fluid"/></c.Column>
                <c.Column><c.Button appearance="fluid"/></c.Column>
                <c.Column><c.Button appearance="fluid"/></c.Column>
                <c.Column><c.Button appearance="fluid"/></c.Column>
              </c.Grid>
            </c.Example>

            <c.Example title="Divided" hint="<Grid appearance='divided'><Row/><Row/>...</Grid>">
              <c.Grid appearance="divided" columns={3}>
                <c.Row>
                  <c.Column><c.LoremIpsum tiny/></c.Column>
                  <c.Column><c.LoremIpsum tiny/></c.Column>
                  <c.Column><c.LoremIpsum tiny/></c.Column>
                </c.Row>
                <c.Row>
                  <c.Column><c.LoremIpsum tiny/></c.Column>
                  <c.Column><c.LoremIpsum tiny/></c.Column>
                  <c.Column><c.LoremIpsum tiny/></c.Column>
                </c.Row>
              </c.Grid>
            </c.Example>

            <c.Example title="Vertically Divided" hint="<Grid appearance='vertically divided'><Row/><Row/>...</Grid>">
              <c.Grid appearance="vertically divided">
                <c.Row columns={2}>
                  <c.Column><c.LoremIpsum short/></c.Column>
                  <c.Column><c.LoremIpsum short/></c.Column>
                </c.Row>
                <c.Row columns={3}>
                  <c.Column><c.LoremIpsum tiny/></c.Column>
                  <c.Column><c.LoremIpsum tiny/></c.Column>
                  <c.Column><c.LoremIpsum tiny/></c.Column>
                </c.Row>
              </c.Grid>
            </c.Example>

            <c.Example title="Celled" hint="<Grid appearance='celled'><Row/><Row/>...</Grid>">
              <c.Grid appearance="celled">
                <c.Row>
                  <c.Column width={4}><c.LoremIpsum tiny/></c.Column>
                  <c.Column width={12}><c.LoremIpsum short/></c.Column>
                </c.Row>
                <c.Row columns={4}>
                  <c.Column><c.LoremIpsum tiny/></c.Column>
                  <c.Column><c.LoremIpsum tiny/></c.Column>
                  <c.Column><c.LoremIpsum tiny/></c.Column>
                  <c.Column><c.LoremIpsum tiny/></c.Column>
                </c.Row>
              </c.Grid>
            </c.Example>

            <c.Example title="Internally Celled" hint="<Grid appearance='internally celled'><Row/><Row/>...</Grid>">
              <c.Grid appearance="internally celled">
                <c.Row>
                  <c.Column width={4}><c.LoremIpsum tiny/></c.Column>
                  <c.Column width={12}><c.LoremIpsum short/></c.Column>
                </c.Row>
                <c.Row columns={4}>
                  <c.Column><c.LoremIpsum tiny/></c.Column>
                  <c.Column><c.LoremIpsum tiny/></c.Column>
                  <c.Column><c.LoremIpsum tiny/></c.Column>
                  <c.Column><c.LoremIpsum tiny/></c.Column>
                </c.Row>
              </c.Grid>
            </c.Example>

            <c.Example title="Padding" hint="<Grid appearance='padded'/>">
              <c.SubHeader>No Padding</c.SubHeader>
              <div style={{border: "1px solid #eee"}}>
                <c.Grid columns={2}>
                  <c.Column><c.Segment/></c.Column>
                  <c.Column><c.Segment/></c.Column>
                </c.Grid>
              </div>

              <c.Spacer/>
              <c.SubHeader>Padded</c.SubHeader>
              <div style={{border: "1px solid #eee"}}>
                <c.Grid columns={2} appearance="padded">
                  <c.Column><c.Segment/></c.Column>
                  <c.Column><c.Segment/></c.Column>
                </c.Grid>
              </div>

              <c.Spacer/>
              <c.SubHeader>Horizontally Padded</c.SubHeader>
              <div style={{border: "1px solid #eee"}}>
                <c.Grid columns={2} appearance="horizontally padded">
                  <c.Column><c.Segment/></c.Column>
                  <c.Column><c.Segment/></c.Column>
                </c.Grid>
              </div>

              <c.Spacer/>
              <c.SubHeader>Vertically Padded</c.SubHeader>
              <div style={{border: "1px solid #eee"}}>
                <c.Grid columns={2} appearance="vertically padded">
                  <c.Column><c.Segment/></c.Column>
                  <c.Column><c.Segment/></c.Column>
                </c.Grid>
              </div>
            </c.Example>

            <c.Example title="Relaxed" hint="<Grid appearance='relaxed'/>">
              <c.SubHeader>Normal</c.SubHeader>
              <c.Grid columns={4}>
                <c.Column><c.Segment/></c.Column>
                <c.Column><c.Segment/></c.Column>
                <c.Column><c.Segment/></c.Column>
                <c.Column><c.Segment/></c.Column>
              </c.Grid>

              <c.Spacer/>
              <c.SubHeader>Relaxed</c.SubHeader>
              <c.Grid columns={4} appearance="relaxed">
                <c.Column><c.Segment/></c.Column>
                <c.Column><c.Segment/></c.Column>
                <c.Column><c.Segment/></c.Column>
                <c.Column><c.Segment/></c.Column>
              </c.Grid>

              <c.Spacer/>
              <c.SubHeader>Very Relaxed</c.SubHeader>
              <c.Grid columns={4} appearance="very relaxed">
                <c.Column><c.Segment/></c.Column>
                <c.Column><c.Segment/></c.Column>
                <c.Column><c.Segment/></c.Column>
                <c.Column><c.Segment/></c.Column>
              </c.Grid>
            </c.Example>

            <c.Example title="Equal Width" hint="<Grid appearance='equal width'/>">
              <c.Grid appearance="equal width">
                  <c.Column width={4}><c.Segment/></c.Column>
                  <c.Column><c.Segment/></c.Column>
                  <c.Column width={4}><c.Segment/></c.Column>
              </c.Grid>

              <c.Grid appearance="equal width">
                <c.Row>
                  <c.Column><c.Segment/></c.Column>
                  <c.Column><c.Segment/></c.Column>
                  <c.Column><c.Segment/></c.Column>
                </c.Row>
                <c.Row>
                  <c.Column><c.Segment/></c.Column>
                  <c.Column><c.Segment/></c.Column>
                  <c.Column><c.Segment/></c.Column>
                  <c.Column><c.Segment/></c.Column>
                </c.Row>
              </c.Grid>
            </c.Example>

            <c.Example title="Streched" hint="<Grid><Row appearance='stretched'/></Grid>">
              <c.Grid columns={3} appearance="equal width">
                <c.Row appearance="stretched">
                  <c.Column><c.Segment/></c.Column>
                  <c.Column><c.Segment/><c.Segment/></c.Column>
                  <c.Column><c.Segment/><c.Segment/><c.Segment/></c.Column>
                </c.Row>
              </c.Grid>
            </c.Example>

            <c.Example title="Colored" hint="<Grid><column color='red'/></Grid>">
              <c.Info>Coloring rows or columns requires a <b>padded</b> grid.</c.Info>
              <c.Grid columns={5} appearance="padded">
                <c.Column color='red'>Red</c.Column>
                <c.Column color='orange'>orange</c.Column>
                <c.Column color='yellow'>yellow</c.Column>
                <c.Column color='olive'>olive</c.Column>
                <c.Column color='green'>green</c.Column>
                <c.Column color='teal'>teal</c.Column>
                <c.Column color='blue'>blue</c.Column>
                <c.Column color='violet'>violet</c.Column>
                <c.Column color='purple'>purple</c.Column>
                <c.Column color='pink'>pink</c.Column>
                <c.Column color='brown'>brown</c.Column>
                <c.Column color='grey'>grey</c.Column>
                <c.Column color='black'>black</c.Column>
              </c.Grid>

              <c.Spacer/>
              <c.Grid appearance="padded">
                <c.Row color='red'><c.Column>Red</c.Column></c.Row>
                <c.Row color='orange'><c.Column>Orange</c.Column></c.Row>
                <c.Row color='yellow'><c.Column>Yellow</c.Column></c.Row>
              </c.Grid>
            </c.Example>

            <c.Example title="Centered" hint="<Grid appearance='centered'/></Grid>">
              <c.Grid columns={2} appearance="centered">
                <c.Column><c.Segment/></c.Column>
                <c.Row columns={4} appearance="centered">
                  <c.Column><c.Segment/></c.Column>
                  <c.Column><c.Segment/></c.Column>
                  <c.Column><c.Segment/></c.Column>
                </c.Row>
              </c.Grid>
            </c.Example>

            <c.Example title="Grid Text Alignment" hint="<Grid align='center'/></Grid>">
              <c.Grid columns={3} align='left'>
                <c.Column><c.Segment>Left</c.Segment></c.Column>
                <c.Column><c.Segment>Left</c.Segment></c.Column>
                <c.Column><c.Segment>Left</c.Segment></c.Column>
              </c.Grid>

              <c.Grid columns={3} align='center'>
                <c.Column><c.Segment>Center</c.Segment></c.Column>
                <c.Column><c.Segment>Center</c.Segment></c.Column>
                <c.Column><c.Segment>Center</c.Segment></c.Column>
              </c.Grid>

              <c.Grid columns={3} align='right'>
                <c.Column><c.Segment>Right</c.Segment></c.Column>
                <c.Column><c.Segment>Right</c.Segment></c.Column>
                <c.Column><c.Segment>Right</c.Segment></c.Column>
              </c.Grid>

            </c.Example>

            <c.Example title="Row Text Alignment" hint="<Grid><Row align='center'/></Grid>">
              <c.Grid columns={3}>
                <c.Row align="left">
                  <c.Column><c.Segment>Left</c.Segment></c.Column>
                  <c.Column><c.Segment>Left</c.Segment></c.Column>
                  <c.Column><c.Segment>Left</c.Segment></c.Column>
                </c.Row>

                <c.Row align="center">
                  <c.Column><c.Segment>Center</c.Segment></c.Column>
                  <c.Column><c.Segment>Center</c.Segment></c.Column>
                  <c.Column><c.Segment>Center</c.Segment></c.Column>
                </c.Row>

                <c.Row align="right">
                  <c.Column><c.Segment>Right</c.Segment></c.Column>
                  <c.Column><c.Segment>Right</c.Segment></c.Column>
                  <c.Column><c.Segment>Right</c.Segment></c.Column>
                </c.Row>

                <c.Row columns={2} align="justified">
                  <c.Column><c.LoremIpsum short/></c.Column>
                  <c.Column><c.LoremIpsum short/></c.Column>
                </c.Row>
              </c.Grid>

            </c.Example>

            <c.Example title="Column Text Alignment" hint="<Grid><Column align='left'/></Grid>">
              <c.Grid columns={4}>
                <c.Column align='left'><c.Segment>Left</c.Segment></c.Column>
                <c.Column align='center'><c.Segment>Center</c.Segment></c.Column>
                <c.Column align='right'><c.Segment>Right</c.Segment></c.Column>
                <c.Column align='justified'><c.LoremIpsum tiny/></c.Column>
              </c.Grid>

            </c.Example>

            <c.Example title="Vertical Alignment" hint="<Grid align='middle'/>">
              <c.SubHeader>align = top</c.SubHeader>
              <c.Grid columns={4} align='top' appearance="centered">
                <c.Column><c.Segment/></c.Column>
                <c.Column><c.Segment/><c.Segment/></c.Column>
                <c.Column><c.Segment/></c.Column>
              </c.Grid>

              <c.Divider/>
              <c.SubHeader>align = middle</c.SubHeader>
              <c.Grid columns={4} align='middle' appearance="centered">
                <c.Column><c.Segment/></c.Column>
                <c.Column><c.Segment/><c.Segment/></c.Column>
                <c.Column><c.Segment/></c.Column>
              </c.Grid>

              <c.Divider/>
              <c.SubHeader>align = bottom</c.SubHeader>
              <c.Grid columns={4} align='bottom' appearance="centered">
                <c.Column><c.Segment/></c.Column>
                <c.Column><c.Segment/><c.Segment/></c.Column>
                <c.Column><c.Segment/></c.Column>
              </c.Grid>

            </c.Example>
          </c.PageSection>


          <c.PageSection title="Responsive design">
            <c.Info>Resize your browser to a small width to see these effects</c.Info>

            <c.Example title="Doubling" hint="<Grid appearance='doubling'/>">
              <c.Grid columns={5} appearance="doubling">
                <c.Column><c.Segment/></c.Column>
                <c.Column><c.Segment/></c.Column>
                <c.Column><c.Segment/></c.Column>
                <c.Column><c.Segment/></c.Column>
                <c.Column><c.Segment/></c.Column>
              </c.Grid>
            </c.Example>

            <c.Example title="Stackable" hint="<Grid appearance='stackable'/>">
              <c.Grid columns={2} appearance="stackable">
                <c.Column><c.Segment/></c.Column>
                <c.Column><c.Segment/></c.Column>
              </c.Grid>
            </c.Example>

            <c.Example title="Reversed" hint="<Grid appearance='tablet reversed'/>">
              <c.SubHeader>computer reversed</c.SubHeader>
              <c.Grid columns={4} appearance="equal width computer reversed">
                <c.Row>
                  <c.Column>1st</c.Column>
                  <c.Column>2nd</c.Column>
                  <c.Column>3nd</c.Column>
                  <c.Column>4th</c.Column>
                </c.Row>
              </c.Grid>

              <c.Divider/>
              <c.SubHeader>tablet reversed</c.SubHeader>
              <c.Grid columns={4} appearance="equal width tablet reversed">
                <c.Row>
                  <c.Column>1st</c.Column>
                  <c.Column>2nd</c.Column>
                  <c.Column>3nd</c.Column>
                  <c.Column>4th</c.Column>
                </c.Row>
              </c.Grid>

              <c.Divider/>
              <c.SubHeader>mobile reversed</c.SubHeader>
              <c.Grid columns={4} appearance="equal width mobile reversed">
                <c.Row>
                  <c.Column>1st</c.Column>
                  <c.Column>2nd</c.Column>
                  <c.Column>3nd</c.Column>
                  <c.Column>4th</c.Column>
                </c.Row>
              </c.Grid>
            </c.Example>

            <c.Example title="Device visibility" hint="<Grid><Row appearance='computer only'/></Grid>">
              <c.Grid>
                <c.Row columns={2} appearance="large screen only">
                  <c.Column><c.Segment>Large Screen Only</c.Segment></c.Column>
                  <c.Column><c.Segment>Large Screen Only</c.Segment></c.Column>
                </c.Row>

                <c.Row columns={2} appearance="computer only">
                  <c.Column><c.Segment>Computer Only</c.Segment></c.Column>
                  <c.Column><c.Segment>Computer Only</c.Segment></c.Column>
                </c.Row>

                <c.Row columns={2} appearance="tablet only">
                  <c.Column><c.Segment>Tablet Only</c.Segment></c.Column>
                  <c.Column><c.Segment>Tablet Only</c.Segment></c.Column>
                </c.Row>

                <c.Row columns={2} appearance="mobile only">
                  <c.Column><c.Segment>Mobile Only</c.Segment></c.Column>
                  <c.Column><c.Segment>Mobile Only</c.Segment></c.Column>
                </c.Row>

                <c.Row appearance="equal width">
                  <c.Column appearance="large screen only"><c.Segment>Mobile Only</c.Segment></c.Column>
                  <c.Column appearance="computer only"><c.Segment>Computer Only</c.Segment></c.Column>
                  <c.Column appearance="tablet only"><c.Segment>Tablet Only</c.Segment></c.Column>
                  <c.Column appearance="mobile only"><c.Segment>Mobile Only</c.Segment></c.Column>
                  <c.Column><c.Segment>All screens</c.Segment></c.Column>
                </c.Row>
              </c.Grid>
            </c.Example>


          </c.PageSection>

        </c.Page>
      </c.CardContainer>
    );
  }
}

"use strict";
import React from "react";
import { Card } from "oak";

export default class TableCard extends Card {
  static defaultProps = {
    id: "Table",
    title: "Table"
  }

  getInitialData() {
    return {
      // header, footer, etc elements WITHOUT wrappers
      headerElement: <tr><th>Food</th><th>Calories</th><th>Protein</th></tr>,
      bodyElement: [<tr><td>Apples</td><td>200</td><td>0g</td></tr>,
                  <tr><td>Bananas</td><td>270</td><td>0g</td></tr>,
                  <tr><td>Oranges</td><td>310</td><td>0g</td></tr>],

      footerElement: <tr><th>Totals</th><th>780</th><th>0g</th></tr>,

      // arrays
      headerArray: ["Type", "Column A","Column B","Column C","Column D"],
      bodyArray: [
        ["Strings", "A1", "B1", "C1", "D1" ],
        ["Numbers", 1, 2, 3, 4 ],
        ["Elements",
          <i className="check icon"/>,
          <img src="http://semantic-ui.com/images/avatar/small/elliot.jpg" className="ui rounded avatar image"/>,
          <b>Some bold text</b>,
          <a href="#">An anchor</a>
        ],
      ],
      footerArray: [" ", "Footer A", "Footer B", "", "Footer D" ],
    }
  }

  // add render method so we get hot reload
  render() { return super.render() }

  // actual card render
  renderChildren({ data, card, stack, project, c }) {
    return (
      <c.CardContainer>
        <c.PageSidebar/>
        <c.Page>
          <c.PageTitle title="Table">
            A table displays a collections of data grouped into rows
            <c.Info>Semantic UI Tables are (so far) fairly limited in this React Wrapper:
              <ul>
                <li>Either you inline html for the <b>thead</b>, <b>tbody</b>, <b>tfoot</b>, directly in the table,
                    in which case you have full control.</li>
                <li>You can pass element <b>thead</b>, <b>tbody</b>, <b>tfoot</b> properties to the table,
                    in which case you have full control over everything.</li>
                <li>You pass an array for <b>thead</b> and <b>tfoot</b>, and an array of arrays inline for <b>tbody</b>.
                  In this case you don't have control over individual row or cell styling.
                </li>
                <li>Note that you can mix and match, eg, inline html for your <b>thead</b>,
                  have your <b>tbody</b> come from an array of arrays, and pass an element <b>tfoot</b> property.
                </li>
              </ul>
            </c.Info>
          </c.PageTitle>

          <c.PageSection title="Content">

            <c.Example title="Fully Inline Table Definition">
              <c.Table>
                <thead><tr><th>A</th><th>B</th><th>C</th></tr></thead>
                <tbody>
                  <tr><td>A1</td><td>D1</td><td>C1</td></tr>
                  <tr><td>A2</td><td>D2</td><td>C2</td></tr>
                  <tr><td>A3</td><td>D3</td><td>C3</td></tr>
                </tbody>
                <tfoot><tr><th>A</th><th>B</th><th>C</th></tr></tfoot>
              </c.Table>
            </c.Example>

            <c.Example title="Header, Body, Footer elements" hint="<Table header={...} footer={...}>{body}</Table>">
              <c.Table header={data.headerElement} footer={data.footerElement} body={data.bodyElement}/>
            </c.Example>

            <c.Example title="Header, Body, Footer arrays" hint="<Table header={...} body={...} footer={...}/>">
              <c.Table header={data.headerArray} body={data.bodyArray} footer={data.footerArray}/>
              <c.Bug>Not sure why that bottom-left cell isn't working...</c.Bug>
            </c.Example>

          </c.PageSection>

          <c.PageSection title="Functionality">
            <c.Example title="Sortable" hint="<Table sorting/>">
              <c.Table sorting header={data.headerElement} body={data.bodyElement} footer={data.footerElement}/>
            </c.Example>
            <c.Bug>What do we have to do to turn soring on?</c.Bug>
          </c.PageSection>

          <c.PageSection title="Appearance">

            <c.Example title="Fixed" hint="<Table appearance='fixed'/>">
              <c.Table appearance="fixed" header={data.headerArray} body={data.bodyArray}/>
            </c.Example>

            <c.Example title="Column Count" hint="<Table columns='2'/>">
              <c.Table columns={5} header={data.headerArray} body={data.bodyArray}/>
            </c.Example>

            <c.Example title="Collapsing" hint="<Table appearance='collapsing'/>">
              <c.Table appearance="collapsing" header={data.headerArray} body={data.bodyArray} footer={data.footerArray}/>
            </c.Example>

            <c.Grid columns={2}>
              <c.Column>
                <c.Example title="Striped" hint="<Table appearance='striped'/>">
                  <c.Table appearance="striped" header={data.headerArray} body={data.bodyArray} footer={data.footerArray}/>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Celled" hint="<Table appearance='celled'/>">
                  <c.Table appearance="celled" header={data.headerArray} body={data.bodyArray} footer={data.footerArray}/>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Basic" hint="<Table appearance='basic'/>">
                  <c.Table appearance="basic" header={data.headerArray} body={data.bodyArray} footer={data.footerArray}/>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Very Basic" hint="<Table appearance='very basic'/>">
                  <c.Table appearance="very basic" header={data.headerArray} body={data.bodyArray} footer={data.footerArray}/>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Definition" hint="<Table appearance='definition'/>">
                  <c.Table appearance="definition" header={data.headerArray} body={data.bodyArray} footer={data.footerArray}/>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Single Line" hint="<Table appearance='single line'/>">
                  <c.Table appearance="single line" header={data.headerArray} body={data.bodyArray}/>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Padded" hint="<Table appearance='padded'/>">
                  <c.Table appearance="padded" header={data.headerArray} body={data.bodyArray}/>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Very Padded" hint="<Table appearance='very padded'/>">
                  <c.Table appearance="very padded" header={data.headerArray} body={data.bodyArray}/>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Compact" hint="<Table appearance='compact'/>">
                  <c.Table appearance="compact" header={data.headerArray} body={data.bodyArray}/>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Very Compact" hint="<Table appearance='very compact'/>">
                  <c.Table appearance="very compact" header={data.headerArray} body={data.bodyArray}/>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Size=small" hint="<Table size='small'/>">
                  <c.Table size="small" header={data.headerElement} body={data.bodyElement}/>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Size=large" hint="<Table size='small'/>">
                  <c.Table size="large" header={data.headerElement} body={data.bodyElement}/>
                </c.Example>
              </c.Column>


              <c.Column>
                <c.Example title="Colored" hint="<Table color='red'/>">
                  <c.Table color='red' header={data.headerElement} body={data.bodyElement}/>
                  <c.Table color='orange' header={data.headerElement} body={data.bodyElement}/>
                  <c.Table color='yellow' header={data.headerElement} body={data.bodyElement}/>
                  <c.Table color='olive' header={data.headerElement} body={data.bodyElement}/>
                  <c.Table color='green' header={data.headerElement} body={data.bodyElement}/>
                  <c.Table color='teal' header={data.headerElement} body={data.bodyElement}/>
                  <c.Table color='blue' header={data.headerElement} body={data.bodyElement}/>
                  <c.Table color='violet' header={data.headerElement} body={data.bodyElement}/>
                  <c.Table color='purple' header={data.headerElement} body={data.bodyElement}/>
                  <c.Table color='pink' header={data.headerElement} body={data.bodyElement}/>
                  <c.Table color='brown' header={data.headerElement} body={data.bodyElement}/>
                  <c.Table color='grey' header={data.headerElement} body={data.bodyElement}/>
                  <c.Table color='black' header={data.headerElement} body={data.bodyElement}/>
                </c.Example>
              </c.Column>
              <c.Column>
                <c.Example title="Inverted" hint="<Table color='red'/>">
                  <c.Table appearance="inverted" header={data.headerArray} body={data.bodyArray} footer={data.footerArray}/>
                  <c.Table appearance="inverted striped" color='red' header={data.headerElement} body={data.bodyElement}/>
                  <c.Table appearance="inverted striped" color='orange' header={data.headerElement} body={data.bodyElement}/>
                  <c.Table appearance="inverted striped" color='yellow' header={data.headerElement} body={data.bodyElement}/>
                  <c.Table appearance="inverted striped" color='olive' header={data.headerElement} body={data.bodyElement}/>
                  <c.Table appearance="inverted striped" color='green' header={data.headerElement} body={data.bodyElement}/>
                  <c.Table appearance="inverted striped" color='teal' header={data.headerElement} body={data.bodyElement}/>
                  <c.Table appearance="inverted striped" color='blue' header={data.headerElement} body={data.bodyElement}/>
                  <c.Table appearance="inverted striped" color='violet' header={data.headerElement} body={data.bodyElement}/>
                  <c.Table appearance="inverted striped" color='purple' header={data.headerElement} body={data.bodyElement}/>
                  <c.Table appearance="inverted striped" color='pink' header={data.headerElement} body={data.bodyElement}/>
                  <c.Table appearance="inverted striped" color='brown' header={data.headerElement} body={data.bodyElement}/>
                  <c.Table appearance="inverted striped" color='grey' header={data.headerElement} body={data.bodyElement}/>
                  <c.Table appearance="inverted striped" color='black' header={data.headerElement} body={data.bodyElement}/>
                </c.Example>
              </c.Column>
            </c.Grid>

          </c.PageSection>

        </c.Page>
      </c.CardContainer>
    );
  }
}

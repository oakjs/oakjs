"use strict";
import React from "react";
import { Card } from "oak";

export default class InputCard extends Card {
  static defaultProps = {
    id: "Input",
    title: "Input"
  }
  renderChildren({ card, stack, project, c }) {
    return (
      <c.CardContainer>
        <c.PageSidebar/>
        <c.Page>
          <c.PageTitle title="Input">
            An input is a field used to elicit a response from a user.
          </c.PageTitle>

          <c.PageSection grid title="Types">
            <c.Example columns={5}>
              <c.Spacer/>
              <c.Label pointing="down">type=text or unspecified</c.Label><br/>
              <c.Input type="text"/>
            </c.Example>

            <c.Example columns={5}>
              <c.Spacer/>
              <c.Label pointing="down">type=button</c.Label><br/>
              <c.Input type="button" value="OK"/>
            </c.Example>

            <c.Example columns={5}>
              <c.Spacer/>
              <c.Label pointing="down">type=checkbox</c.Label><br/>
              <c.Input type="checkbox" label="Checkbox label"/>
            </c.Example>

            <c.Example columns={5}>
              <c.Spacer/>
              <c.Label pointing="down">type=date</c.Label><br/>
              <c.Input type="date"/>
            </c.Example>

            <c.Example columns={5}>
              <c.Spacer/>
              <c.Label pointing="down">type=datetime</c.Label><br/>
              <c.Input type="datetime"/>
            </c.Example>

            <c.Example columns={5}>
              <c.Spacer/>
              <c.Label pointing="down">type=datetime-local</c.Label><br/>
              <c.Input type="datetime-local"/>
            </c.Example>

            <c.Example columns={5}>
              <c.Spacer/>
              <c.Label pointing="down">type=email</c.Label><br/>
              <c.Input type="email"/>
            </c.Example>

            <c.Example columns={10}>
              <c.Spacer/>
              <c.Label pointing="down">type=file</c.Label><br/>
              <c.Input type="file"/>
            </c.Example>

            <c.Example columns={5}>
              <c.Spacer/>
              <c.Label pointing="down">type=hidden</c.Label><br/>
              <c.Input type="hidden"/>
            </c.Example>

            <c.Example columns={5}>
              <c.Spacer/>
              <c.Label pointing="down">type=image</c.Label><br/>
              <c.Input type="image"/>
            </c.Example>

            <c.Example columns={5}>
              <c.Spacer/>
              <c.Label pointing="down">type=month</c.Label><br/>
              <c.Input type="month"/>
            </c.Example>

            <c.Example columns={5}>
              <c.Spacer/>
              <c.Label pointing="down">type=password</c.Label><br/>
              <c.Input type="password"/>
            </c.Example>

            <c.Example columns={5}>
              <c.Spacer/>
              <c.Label pointing="down">type=number</c.Label><br/>
              <c.Input type="number" min={0} max={10}/>
            </c.Example>

            <c.Example columns={5}>
              <c.Spacer/>
              <c.Label pointing="down">type=password</c.Label><br/>
              <c.Input type="password"/>
            </c.Example>

            <c.Example columns={5}>
              <c.Spacer/>
              <c.Label pointing="down">type=radio</c.Label><br/>
              <c.Input type="radio" name="a" value="1" label="Option 1"/><br/>
              <c.Input type="radio" name="a" value="2" label="Option 2"/><br/>
            </c.Example>

            <c.Example columns={5}>
              <c.Spacer/>
              <c.Label pointing="down">type=range</c.Label><br/>
              <c.Input type="range" min={0} max={10}/>
            </c.Example>

            <c.Example columns={5}>
              <c.Spacer/>
              <c.Label pointing="down">type=reset</c.Label><br/>
              <c.Input type="reset" value="Reset"/>
            </c.Example>

            <c.Example columns={5}>
              <c.Spacer/>
              <c.Label pointing="down">type=search</c.Label><br/>
              <c.Input type="search"/>
            </c.Example>

            <c.Example columns={5}>
              <c.Spacer/>
              <c.Label pointing="down">type=submit</c.Label><br/>
              <c.Input type="submit" value="Save"/>
            </c.Example>

            <c.Example columns={5}>
              <c.Spacer/>
              <c.Label pointing="down">type=tel</c.Label><br/>
              <c.Input type="tel"/>
            </c.Example>

            <c.Example columns={5}>
              <c.Spacer/>
              <c.Label pointing="down">type=time</c.Label><br/>
              <c.Input type="time"/>
            </c.Example>

            <c.Example columns={5}>
              <c.Spacer/>
              <c.Label pointing="down">type=url</c.Label><br/>
              <c.Input type="url"/>
            </c.Example>

            <c.Example columns={5}>
              <c.Spacer/>
              <c.Label pointing="down">type=week</c.Label><br/>
              <c.Input type="week"/>
            </c.Example>

          </c.PageSection>

          <c.PageSection grid title="States">
              <c.Example title="Normal" hint="<Input/>" columns={5}>
                <c.Input/>
              </c.Example>

              <c.Example title="Disabled" hint="<Input disabled/>" columns={5}>
                <c.Input disabled value="text"/>
              </c.Example>

              <c.Example title="Hidden" hint="<Input hidden/>" columns={5}>
                <c.Input hidden value="text"/>
              </c.Example>

              <c.Example title="Loading" hint="<Input loading icon='search'/>" columns={5}>
                <c.Input loading icon="search"/>
              </c.Example>

              <c.Example title="Focused" hint="<Input focused/>" columns={5}>
                <c.Input focused/>
              </c.Example>

              <c.Example title="Error" hint="<Input error/>" columns={5}>
                <c.Input error="A value is required" value="text"/>
              </c.Example>

          </c.PageSection>

          <c.PageSection title="Appearance">

              <c.Example title="Icon" hint="<Input icon='search' iconOn='right'/>">
                <c.Grid columns={3}>
                  <c.Column>
                    <c.Input icon="search"/>
                  </c.Column>
                  <c.Column>
                    <c.Input icon="search" iconOn="left"/>
                  </c.Column>
                  <c.Column>
                    <c.Input icon="inverted circular search link icon"/>
                  </c.Column>
                </c.Grid>
              </c.Example>

              <c.Example title="Labelled" hint="<Input label='Search' labelOn='right'/>">
                <c.Grid columns={3}>
                  <c.Column>
                    <c.Input label="http://"/>
                  </c.Column>
                  <c.Column>
                    <c.Input label=".com" labelOn="right"/>
                  </c.Column>
                  <c.Column>
                    <c.Input label="kg" labelOn="right" labelAppearance="basic"/>
                  </c.Column>

                  <c.Column>
                    <c.Input maxlength={5} icon="tags" iconOn="left" appearance="fluid" label="Tags" labelAppearance="tag" labelOn="right"/>
                  </c.Column>
                  <c.Column>
                    <c.Input appearance="left corner labeled">
                      <div className="ui left corner label">
                        <c.Icon icon="asterisk"/>
                      </div>
                    </c.Input>
                  </c.Column>
                  <c.Column>
                    <c.Input appearance="corner labeled">
                      <div className="ui corner label">
                        <c.Icon icon="asterisk"/>
                      </div>
                    </c.Input>
                  </c.Column>
                </c.Grid>
              </c.Example>

              <c.Example title="Action" hint="<Input><Button></Input>">
                <c.Grid columns={3}>
                  <c.Column>
                    <c.Input placeholder="Search..." appearance="action">
                      <c.Button title="Search"/>
                    </c.Input>
                  </c.Column>
                  <c.Column>
                    <c.Input value="$52.03" appearance="fluid left action" childrenOn="left">
                      <c.Button color="teal" title="Checkout"/>
                    </c.Input>
                  </c.Column>
                  <c.Column>
                    <c.Input icon="search" iconOn="left" placeholder="search" appearance="fluid right action" >
                      <div className="ui floating dropdown button">
                        <div className="text">This Page</div>
                        <c.Icon icon="dropdown"/>
                      </div>
                    </c.Input>
                  </c.Column>
                </c.Grid>
              </c.Example>

              <c.Example title="Transparent" hint="<Input appearance='transparent'/>">
                <c.Grid columns={3}>
                  <c.Column>
                    <c.Input placeholder="Search..." appearance="transparent"/>
                  </c.Column>
                  <c.Column>
                    <c.Input placeholder="Search..." icon="search" iconOn="left" appearance="transparent"/>
                  </c.Column>
                  <c.Column>
                    <c.Input placeholder="Search..." icon="search" appearance="transparent"/>
                  </c.Column>
                </c.Grid>
              </c.Example>

              <c.Example title="Inverted" hint="<Input appearance='inverted'/>">
                <c.Segment appearance="inverted">
                  <c.Grid columns={3} appearance="inverted">
                    <c.Column>
                      <c.Input placeholder="Search..." appearance="inverted"/>
                    </c.Column>
                    <c.Column>
                      <c.Input placeholder="Search..." icon="search" iconOn="left" appearance="inverted"/>
                    </c.Column>
                    <c.Column>
                      <c.Input placeholder="Search..." icon="search" appearance="inverted transparent"/>
                    </c.Column>
                  </c.Grid>
                </c.Segment>
              </c.Example>

              <c.Example title="Fluid" hint="<Input appearance='fluid'/>">
                <c.Input placeholder="Search..." icon="search" appearance="fluid"/>
                <c.Spacer/>
                <c.Input placeholder="Search..." icon="search" iconOn="left" appearance="fluid action">
                  <c.Button>Search</c.Button>
                </c.Input>
              </c.Example>

              <c.Example title="Sizes" hint="<Input size='mini'/>">
                <c.Input placeholder="Mini" icon="search" size="mini"/>
                <c.Spacer/>
                <c.Input placeholder="Small" icon="search" size="small"/>
                <c.Spacer/>
                <c.Input placeholder="Medium" icon="search" size="medium"/>
                <c.Spacer/>
                <c.Input placeholder="Large" icon="search" size="large"/>
                <c.Spacer/>
                <c.Input placeholder="Huge" icon="search" size="huge"/>
                <c.Spacer/>
                <c.Input placeholder="Massive" icon="search" size="massive"/>
                <c.Spacer/>
              </c.Example>

          </c.PageSection>
        </c.Page>
      </c.CardContainer>
    );
  }
}

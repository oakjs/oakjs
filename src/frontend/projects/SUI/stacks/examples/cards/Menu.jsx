"use strict";
import React from "react";
import { Card } from "oak";

import { Button, Input, Menu, MenuItem, MenuHeader } from "themes/SUI";

export default class MenuCard extends Card {
  static defaultProps = {
    id: "Menu",
    title: "Menu"
  }

  getInitialData() {
    return {

      simpleItems: [
        <MenuItem active href="#">Editorials</MenuItem>,
        <MenuItem href="#">Reviews</MenuItem>,
        <MenuItem href="#">Upcoming Events</MenuItem>
      ],

      homeToLogoutItems: [
        <MenuItem active href="#">Home</MenuItem>,
        <MenuItem href="#">Messages</MenuItem>,
        <MenuItem href="#">Friends</MenuItem>,
        <Menu appearance="right">
          <MenuItem>
            <Input icon="search" iconOn="right" placeholder="Search"/>
          </MenuItem>
          <MenuItem href="#">Logout</MenuItem>
        </Menu>,
      ],

      topTabItems: [
        <MenuItem active href="#">Bio</MenuItem>,
        <MenuItem href="#">Photos</MenuItem>,
        <MenuItem appearance="right">
          <Input appearance="transparent" icon="search" iconOn="right" placeholder="Search users..."/>
        </MenuItem>
      ],

      bottomTabItems: [
        <MenuItem active href="#">Active Project</MenuItem>,
        <MenuItem href="#">Project #2</MenuItem>,
        <MenuItem href="#">Project #3</MenuItem>,
        <Menu appearance="right">
          <MenuItem icon="plus">New Tab</MenuItem>
        </Menu>
      ],

      textItems: [
        <MenuHeader>Sort by</MenuHeader>,
        <MenuItem active href="#">Closest</MenuItem>,
        <MenuItem href="#">Most Comments</MenuItem>,
        <MenuItem href="#">Most Popular</MenuItem>,
      ],

      verticalItems: [
        <MenuItem active href="#">Account</MenuItem>,
        <MenuItem href="#">Settings</MenuItem>,
        <MenuItem href="#">Options...</MenuItem>,
      ],

      paginationItems: [
        <MenuItem href="#" disabled icon="left chevron"/>,
        <MenuItem active href="#">1</MenuItem>,
        <MenuItem href="#">2</MenuItem>,
        <MenuItem href="#">3</MenuItem>,
        <MenuItem href="#">...</MenuItem>,
        <MenuItem href="#">10</MenuItem>,
        <MenuItem href="#">11</MenuItem>,
        <MenuItem href="#">12</MenuItem>,
        <MenuItem href="#" icon="right chevron"/>
      ],

      iconItems: [
        <MenuItem href="#" icon="gamepad"/>,
        <MenuItem href="#" icon="camera"/>,
        <MenuItem href="#" icon="video camera"/>,
        <MenuItem href="#" icon="video play"/>,
      ],

      labeledIconItems: [
        <MenuItem href="#" icon="gamepad">Games</MenuItem>,
        <MenuItem href="#" icon="camera">Photos</MenuItem>,
        <MenuItem href="#" icon="video camera">Channels</MenuItem>,
        <MenuItem href="#" icon="video play">Videos</MenuItem>,
      ]

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
          <c.PageTitle title="Menu">
            A menu displays grouped navigation actions
          </c.PageTitle>

          <c.PageSection title="Types">

            <c.Example title="Normal">
              <c.Menu items={data.simpleItems}/>
              <c.Menu items={data.homeToLogoutItems}/>
            </c.Example>

            <c.Example title="Secondary" hint="<Menu appearance='secondary'/>">
              <c.Menu appearance="secondary" items={data.homeToLogoutItems}/>
            </c.Example>

            <c.Example title="Pointing" hint="<Menu appearance='pointing'/>">
              <c.Menu appearance="pointing" items={data.homeToLogoutItems}/>

              <c.Spacer/>
              <c.Label color="teal" pointing="down">Secondary pointing</c.Label>
              <c.Menu appearance="secondary pointing" items={data.homeToLogoutItems}/>
            </c.Example>

            <c.Example title="Tabular" hint="<Menu appearance='tabular'/>">
              <c.Menu appearance="tabular" items={data.topTabItems}/>

              <c.Spacer/>
              <c.Label color="teal" pointing="down">bottom tabular</c.Label>
              <c.Menu appearance="bottom tabular" items={data.topTabItems}/>

              <c.Grid columns={2}>
                <c.Column>
                  <c.Label color="teal" pointing="down">vertical left tabular</c.Label>
                  <c.Menu appearance="vertical left tabular" items={data.topTabItems}/>
                </c.Column>

                <c.Column>
                  <c.Label color="teal" pointing="down">vertical right tabular</c.Label>
                  <c.Menu appearance="vertical right tabular" items={data.topTabItems}/>
                </c.Column>
              </c.Grid>
            </c.Example>

            <c.Example title="Pagination" hint="<Menu appearance='pagination'/>">
              <c.Menu appearance="pagination" items={data.paginationItems}/>
            </c.Example>

            <c.Example title="Text" hint="<Menu appearance='text'/>">
              <c.Menu appearance="text" items={data.textItems}/>
            </c.Example>

            <c.Example title="Icons only" hint="<Menu appearance='icon'/>">
              <c.Menu appearance='icon compact' items={data.iconItems}/>
            </c.Example>

            <c.Example title="Labeled icon" hint="<Menu appearance='labeled icon'/>">
              <c.Menu appearance='labeled icon compact' items={data.labeledIconItems}/>
            </c.Example>

            <c.Example title="Vertical" hint="<Menu appearance='vertical'/>">
              <c.Grid columns={3}>
                <c.Column>
                  <c.Label color="teal" pointing="down">Vertical</c.Label>
                  <c.Menu appearance="vertical" items={data.verticalItems}/>
                </c.Column>

                <c.Column>
                  <c.Label color="teal" pointing="down">Vertical Pointing</c.Label>
                  <c.Menu appearance="vertical pointing" items={data.verticalItems}/>
                </c.Column>

                <c.Column>
                  <c.Label color="teal" pointing="down">Vertical Tabular</c.Label>
                  <c.Menu appearance="vertical tabular" items={data.verticalItems}/>
                </c.Column>

                <c.Column>
                  <c.Label color="teal" pointing="down">Secondary Vertical</c.Label>
                  <c.Menu appearance="secondary vertical" items={data.verticalItems}/>
                </c.Column>

                <c.Column>
                   <c.Label color="teal" pointing="down">Secondary Vertical Pointing</c.Label>
                   <c.Menu appearance="secondary vertical pointing" items={data.verticalItems}/>
                </c.Column>

                <c.Column>
                  <c.Label color="teal" pointing="down">Vertical Text</c.Label>
                  <c.Menu appearance="vertical text" items={data.verticalItems}/>
                </c.Column>
              </c.Grid>
            </c.Example>

          </c.PageSection>

          <c.PageSection title="Appearance">

            <c.Example title="Fluid" hint="<Menu appearance='fluid'/>">
              <c.Menu appearance="vertical fluid" items={data.simpleItems}/>
            </c.Example>

            <c.Example title="Compact" hint="<Menu appearance='compact'/>">
              <c.Menu appearance="compact" items={data.simpleItems}/>
            </c.Example>

            <c.Example title="Evenly divided" hint="<Menu itemCount={3}/>">
              <c.Menu itemCount={3} items={data.simpleItems}/>
            </c.Example>

            <c.Example title="Pointing" hint="<Menu appearance='pointing'/>">
              <c.Menu appearance='pointing vertical' items={data.labeledIconItems}/>
              <c.Bug>
                <a href="http://semantic-ui.com/collections/menu.html#evenly-divided" target="_blank">SUI example</a> for
                this works, why doesn't ours?
              </c.Bug>
            </c.Example>

            <c.Example title="Attached" hint="<Menu appearance='top attached'/>">
              <c.Menu appearance="top attached" items={data.simpleItems}/>
              <c.Segment appearance="attached">
                <c.LoremIpsum short/>
              </c.Segment>
              <c.Menu appearance="bottom attached" items={data.simpleItems}/>

              <c.Label color="teal" pointing="down">secondary attached</c.Label>
              <c.Menu appearance="secondary top attached" items={data.simpleItems}/>
              <c.Segment appearance="attached">
                <c.LoremIpsum short/>
              </c.Segment>
              <c.Menu appearance="secondary bottom attached" items={data.simpleItems}/>

              <c.Label color="teal" pointing="down">pointing attached</c.Label>
              <c.Menu appearance="pointing top attached" items={data.simpleItems}/>
              <c.Segment appearance="bottom attached">
                <c.LoremIpsum short/>
              </c.Segment>

              <c.Label color="teal" pointing="down">tabular attached</c.Label>
              <c.Menu appearance="tabular attached" items={data.simpleItems}/>
              <c.Segment appearance="bottom attached">
                <c.LoremIpsum short/>
              </c.Segment>

              <c.Segment appearance="top attached">
                <c.LoremIpsum short/>
              </c.Segment>
              <c.Menu appearance="tabular bottom attached" items={data.simpleItems}/>

            </c.Example>

            <c.Example title="Inverted" hint="<Menu appearance='inverted'/>">
              <c.Menu appearance="inverted" items={data.homeToLogoutItems}/>

              <c.Spacer/>
              <c.Label color="teal" pointing="down">inverted pointing</c.Label>
              <c.Menu appearance="inverted pointing" items={data.homeToLogoutItems}/>

              <c.Spacer/>
              <c.Label color="teal" pointing="down">inverted pagination</c.Label>
              <c.Spacer tiny/>
              <c.Menu appearance="inverted pagination" items={data.paginationItems}/>

              <c.Spacer/>
              <c.Label color="teal" pointing="down">inverted secondary (inside segment)</c.Label>
              <c.Segment appearance="inverted">
                <c.Menu appearance="inverted secondary" items={data.homeToLogoutItems}/>
              </c.Segment>
              <c.Label color="teal" pointing="down">inverted secondary pointing (inside segment)</c.Label>
              <c.Segment appearance="inverted">
                <c.Menu appearance="inverted secondary pointing" items={data.homeToLogoutItems}/>
              </c.Segment>
              <c.Label color="teal" pointing="down">inverted tabular (inside segment)</c.Label>
              <c.Segment appearance="inverted">
                <c.Menu appearance="inverted tabular" items={data.topTabItems}/>
              </c.Segment>
            </c.Example>

            <c.Spacer/>
            <c.Grid columns={3}>
              <c.Column>
                <c.Label color="teal" pointing="down">inverted vertical pointing</c.Label>
                <c.Menu appearance="inverted vertical" items={data.verticalItems}/>
              </c.Column>

              <c.Column>
                <c.Label color="teal" pointing="down">inverted vertical pointing</c.Label>
                <c.Menu appearance="inverted vertical pointing" items={data.verticalItems}/>
              </c.Column>

              <c.Column>
                <c.Label color="teal" pointing="down">inverted vertical tabular (inside segment)</c.Label>
                <c.Segment appearance="inverted compact">
                  <c.Menu appearance="inverted vertical tabular" items={data.verticalItems}/>
                </c.Segment>
                <c.Bug>SUI rendering bug???</c.Bug>
              </c.Column>

              <c.Column>
                <c.Label color="teal" pointing="down">inverted secondary vertical (inside segment)</c.Label>
                <c.Segment appearance="inverted compact">
                  <c.Menu appearance="inverted secondary vertical" items={data.verticalItems}/>
                </c.Segment>
              </c.Column>

              <c.Column>
                <c.Label color="teal" pointing="down">inverted secondary vertical pointing (in segment)</c.Label>
                <c.Segment appearance="inverted compact">
                  <c.Menu appearance="inverted secondary vertical pointing" items={data.verticalItems}/>
                </c.Segment>
              </c.Column>

              <c.Column>
                <c.Label color="teal" pointing="down">inverted vertical text (inside segment)</c.Label>
                <c.Segment appearance="inverted compact">
                  <c.Menu appearance="inverted vertical text" items={data.verticalItems}/>
                </c.Segment>
                <c.Bug>Active item is not well highlighted</c.Bug>
              </c.Column>
            </c.Grid>

            <c.Example title="Colored" hint="<Menu color='red'/>">
              <c.Grid columns={2}>
                <c.Column>
                  <c.Menu color="red" itemCount={3} items={data.simpleItems}/>
                  <c.Menu color="orange" itemCount={3} items={data.simpleItems}/>
                  <c.Menu color="yellow" itemCount={3} items={data.simpleItems}/>
                  <c.Menu color="olive" itemCount={3} items={data.simpleItems}/>
                  <c.Menu color="green" itemCount={3} items={data.simpleItems}/>
                  <c.Menu color="teal" itemCount={3} items={data.simpleItems}/>
                  <c.Menu color="blue" itemCount={3} items={data.simpleItems}/>
                  <c.Menu color="violet" itemCount={3} items={data.simpleItems}/>
                  <c.Menu color="purple" itemCount={3} items={data.simpleItems}/>
                  <c.Menu color="pink" itemCount={3} items={data.simpleItems}/>
                  <c.Menu color="brown" itemCount={3} items={data.simpleItems}/>
                  <c.Menu color="grey" itemCount={3} items={data.simpleItems}/>
                </c.Column>
                <c.Column>
                  <c.Menu color="inverted red" itemCount={3} items={data.simpleItems}/>
                  <c.Menu color="inverted orange" itemCount={3} items={data.simpleItems}/>
                  <c.Menu color="inverted yellow" itemCount={3} items={data.simpleItems}/>
                  <c.Menu color="inverted olive" itemCount={3} items={data.simpleItems}/>
                  <c.Menu color="inverted green" itemCount={3} items={data.simpleItems}/>
                  <c.Menu color="inverted teal" itemCount={3} items={data.simpleItems}/>
                  <c.Menu color="inverted blue" itemCount={3} items={data.simpleItems}/>
                  <c.Menu color="inverted violet" itemCount={3} items={data.simpleItems}/>
                  <c.Menu color="inverted purple" itemCount={3} items={data.simpleItems}/>
                  <c.Menu color="inverted pink" itemCount={3} items={data.simpleItems}/>
                  <c.Menu color="inverted brown" itemCount={3} items={data.simpleItems}/>
                  <c.Menu color="inverted grey" itemCount={3} items={data.simpleItems}/>
                </c.Column>
              </c.Grid>
            </c.Example>

            <c.Example title="Sizes" hint="<Menu size='large'/>">
              <c.Label color="teal" pointing="down">small</c.Label>
              <c.Menu size='small' items={data.homeToLogoutItems}/>

              <c.Label color="teal" pointing="down">medium (default size)</c.Label>
              <c.Menu size='medium' items={data.homeToLogoutItems}/>

              <c.Label color="teal" pointing="down">large</c.Label>
              <c.Menu size='default' items={data.homeToLogoutItems}/>
            </c.Example>

            <c.Example title="Stackable" hint="<Menu appearance='stackable'/>">
              <c.Menu appearance="stackable" items={data.homeToLogoutItems}/>
              <c.Info>Stackable isn't super capable here...</c.Info>
            </c.Example>

          </c.PageSection>

        </c.Page>
      </c.CardContainer>
    );
  }
}

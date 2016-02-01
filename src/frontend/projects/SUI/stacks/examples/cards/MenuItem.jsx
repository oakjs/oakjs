"use strict";
import React from "react";
import { Card } from "oak";

import { Button, Input, Menu, MenuItem, MenuHeader } from "themes/SUI";

export default class MenuItemCard extends Card {
  static defaultProps = {
    id: "MenuItem",
    title: "MenuItem"
  }

  getInitialData() {
    return {

      simpleItems: [
        <MenuHeader>News</MenuHeader>,
        <MenuItem active>Editorials</MenuItem>,
        <MenuItem>Reviews</MenuItem>,
        <MenuItem>Events</MenuItem>
      ],
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
          <c.PageTitle title="MenuItem">
            A MenuItem is one item in a menu.
          </c.PageTitle>

          <c.PageSection title="Content">

            <c.Example title="Inline contents">
              <c.Menu appearance="vertical">
                <c.MenuItem>Inline content</c.MenuItem>
                <c.MenuItem><c.Icon icon="checkmark"/>Inline with icon</c.MenuItem>
                <c.MenuItem><span>Inline with <b> nested html</b></span></c.MenuItem>
                <c.MenuItem><c.Header>In-item header</c.Header><p>Inline item text</p></c.MenuItem>
              </c.Menu>
            </c.Example>

            <c.Example title="Label and icon attributes">
              <c.Menu>
                <c.MenuItem label="Label attribute"/>
                <c.MenuItem label="Label and icon attributes" icon="checkmark"/>
              </c.Menu>
            </c.Example>

            <c.Example title="Menu">
              <c.Menu>
                <c.MenuItem>Left Item 1</c.MenuItem>
                <c.MenuItem>Left Item 2</c.MenuItem>
                <c.Menu appearance="right">
                  <c.MenuItem>Right Item 1</c.MenuItem>
                  <c.MenuItem>Right Item 2</c.MenuItem>
                </c.Menu>
              </c.Menu>
            </c.Example>

            <c.Example title="Sub Menu">
              <c.Menu appearance="vertical">
                <c.MenuItem>Home</c.MenuItem>
                <c.MenuItem>Browse</c.MenuItem>
                <c.Submenu label="More">
                  <c.MenuItem>Edit Profile</c.MenuItem>
                  <c.MenuItem>Choose Language</c.MenuItem>
                  <c.Divider/>
                  <c.MenuItem>Account Settings</c.MenuItem>
                </c.Submenu>
                <c.Submenu label="Yet More" items={["Edit Profile", "Choose Language", "-----", "Account Settings"]}/>
              </c.Menu>
            </c.Example>

            <c.Example title="Input">
              <c.Menu>
                <c.MenuItem><c.Input placeholder="search" icon="search"/></c.MenuItem>
              </c.Menu>
            </c.Example>

            <c.Example title="Button">
              <c.Menu>
                <c.MenuItem><c.Button appearance="primary" title="Sign up"/></c.MenuItem>
              </c.Menu>
            </c.Example>

            <c.Example title="Dropdown">
              <c.Todo>Add a dropdown example</c.Todo>
            </c.Example>

            <c.Example title="Popup">
              <c.Todo>Add a popup example</c.Todo>
            </c.Example>

          </c.PageSection>


          <c.PageSection title="States">

            <c.Example title="Hover" hint="<MenuItem href='...'/> or <MenuItem onClick='...'/> or <MenuItem appearance='link'/>">
              <c.Menu appearance="compact">
                <c.MenuItem href="#" label="Anchor"/>
                <c.MenuItem onClick={Function.prototype} label="onClick item"/>
                <c.MenuItem appearance="link" label="appearance = link"/>
              </c.Menu>
            </c.Example>

            <c.Example title="Active" hint="<MenuItem active/>">
              <c.Menu appearance="compact">
                <c.MenuItem appearance="link" label="Normal"/>
                <c.MenuItem active appearance="link" label="Active"/>
              </c.Menu>
            </c.Example>

            <c.Example title="Disabled" hint="<MenuItem disabled/>">
              <c.Menu appearance="compact">
                <c.MenuItem appearance="link" label="Normal"/>
                <c.MenuItem disabled appearance="link" label="Disabled"/>
              </c.Menu>
            </c.Example>

            <c.Example title="Down" hint="<MenuItem down/>">
              <c.Menu appearance="compact">
                <c.MenuItem appearance="link" label="Normal"/>
                <c.MenuItem down appearance="link" label="Down"/>
              </c.Menu>
              <c.Bug>The "down" state doesn't seem to have an effect with the default SUI styles.</c.Bug>
            </c.Example>


          </c.PageSection>


          <c.PageSection title="Appearance">

            <c.Example title="Format as a link" hint="<MenuItem href='...'/> or <MenuItem appearance='link'/>">
              <c.Menu>
                <c.MenuItem href="http://www.google.com" target="_blank" label="Visit Google"/>
                <c.MenuItem appearance="link" label="Visit Google"/>
              </c.Menu>
            </c.Example>

            <c.Example title="Alignment" hint="<MenuItem align='right'/>">
              <c.Menu>
                <c.MenuItem align="left" label="Left Aligned"/>
                <c.MenuItem align="center" label="Center Aligned"/>
                <c.MenuItem align="justified" label="Completely Justified"/>
                <c.MenuItem align="right" label="RightAligned"/>
              </c.Menu>

              <c.Menu itemCount={4}>
                <c.MenuItem align="left" label="Left Aligned"/>
                <c.MenuItem align="center" label="Center Aligned"/>
                <c.MenuItem align="justified" label="Completely Justified"/>
                <c.MenuItem align="right" label="RightAligned"/>
              </c.Menu>
            </c.Example>

            <c.Example title="Color" hint="<MenuItem color='red'/>  NOTE: items are only colored when active.">
              <c.Menu>
                <c.MenuItem active color="red">red</c.MenuItem>
                <c.MenuItem active color="orange">orange</c.MenuItem>
                <c.MenuItem active color="yellow">yellow</c.MenuItem>
                <c.MenuItem active color="olive">olive</c.MenuItem>
                <c.MenuItem active color="green">green</c.MenuItem>
                <c.MenuItem active color="teal">teal</c.MenuItem>
                <c.MenuItem active color="blue">blue</c.MenuItem>
                <c.MenuItem active color="violet">violet</c.MenuItem>
                <c.MenuItem active color="purple">purple</c.MenuItem>
                <c.MenuItem active color="brown">brown</c.MenuItem>
                <c.MenuItem active color="grey">grey</c.MenuItem>
              </c.Menu>
            </c.Example>

            <c.Example title="Inverted Color" hint="<Menu appearance='inverted'><MenuItem color='red'/></Menu>">
              <c.Menu appearance="inverted" color='red' items={data.simpleItems} itemCount={4}/>
              <c.Menu appearance="inverted" color='orange' items={data.simpleItems} itemCount={4}/>
              <c.Menu appearance="inverted" color='yellow' items={data.simpleItems} itemCount={4}/>
              <c.Menu appearance="inverted" color='olive' items={data.simpleItems} itemCount={4}/>
              <c.Menu appearance="inverted" color='green' items={data.simpleItems} itemCount={4}/>
              <c.Menu appearance="inverted" color='teal' items={data.simpleItems} itemCount={4}/>
              <c.Menu appearance="inverted" color='blue' items={data.simpleItems} itemCount={4}/>
              <c.Menu appearance="inverted" color='violet' items={data.simpleItems} itemCount={4}/>
              <c.Menu appearance="inverted" color='purple' items={data.simpleItems} itemCount={4}/>
              <c.Menu appearance="inverted" color='pink' items={data.simpleItems} itemCount={4}/>
              <c.Menu appearance="inverted" color='brown' items={data.simpleItems} itemCount={4}/>
              <c.Menu appearance="inverted" color='grey' items={data.simpleItems} itemCount={4}/>
            </c.Example>

          </c.PageSection>

        </c.Page>
      </c.CardContainer>
    );
  }
}

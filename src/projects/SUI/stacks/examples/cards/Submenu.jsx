"use strict";
import React from "react";
import Card from "oak/Card";

import { Button, Input, Menu, MenuItem, MenuHeader } from "themes/SUI";

export default class MenuHeaderCard extends Card {
  static defaultProps = {
    id: "Submenu",
    title: "Submenu"
  }

  getInitialData() {
    return {

      simpleItems: [
        <MenuHeader icon="newspaper">Breaking News</MenuHeader>,
        <MenuItem icon="comment outline">Editorials</MenuItem>,
        <MenuItem active icon="film">Movie Reviews</MenuItem>,
        <MenuItem icon="calendar">Current Events</MenuItem>
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
          <c.PageTitle title="Submenu">
            A Submenu shows a nested menu
          </c.PageTitle>

          <c.PageSection title="Content">

            <c.Example title="Inline contents">
              <c.Menu appearance="vertical">
                <c.MenuItem>A normal item</c.MenuItem>
                <c.Submenu>
                  More Stuff
                  <c.MenuHeader icon="newspaper">Breaking News</c.MenuHeader>
                  <c.MenuItem icon="comment outline">Editorials</c.MenuItem>
                  <c.MenuItem active icon="film">Movie Reviews</c.MenuItem>
                  <c.MenuItem icon="calendar">Current Events</c.MenuItem>
                </c.Submenu>
                <c.MenuItem>Another normal item</c.MenuItem>
              </c.Menu>
            </c.Example>

            <c.Example title="Items as MenuItem Elements">
              <c.Menu appearance="vertical">
                <c.MenuItem>A normal item</c.MenuItem>
                <c.Submenu label="More Stuff" items={data.simpleItems}/>
                <c.MenuItem>Another normal item</c.MenuItem>
              </c.Menu>
            </c.Example>

            <c.Example title="Items as Strings">
              <c.Menu appearance="vertical">
                <c.MenuItem>A normal item</c.MenuItem>
                <c.Submenu label="More Stuff" items={["Breaking News", "Editorials", "Movie Reviews", "Current Events"]}/>
                <c.MenuItem>Another normal item</c.MenuItem>
              </c.Menu>
            </c.Example>

          </c.PageSection>

        </c.Page>
      </c.CardContainer>
    );
  }
}

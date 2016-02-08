"use strict";
import React from "react";
import { Card } from "oak";

import { Button, Input, Menu, MenuItem, MenuHeader } from "themes/SUI";

export default class MenuHeaderCard extends Card {
  static defaultProps = {
    id: "MenuHeader",
    title: "MenuHeader"
  }

  getInitialData() {
    return {

      simpleItems: [
        <MenuHeader>News</MenuHeader>,
        <MenuItem>Editorials</MenuItem>,
        <MenuItem active>Reviews</MenuItem>,
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
          <c.PageTitle title="MenuHeader">
            A MenuHeader shows a header inside a menu.
          </c.PageTitle>

          <c.PageSection title="Content">

            <c.Example title="Inline contents">
              <c.Menu appearance="vertical">
                <c.MenuHeader>Inline content</c.MenuHeader>
                <c.MenuHeader><c.Icon icon="checkmark"/>Inline with icon</c.MenuHeader>
                <c.MenuHeader><span>Inline with <b> nested html</b></span></c.MenuHeader>
              </c.Menu>
            </c.Example>

            <c.Example title="Label and icon attributes">
              <c.Menu appearance="vertical">
                <c.MenuHeader label="Label attribute"/>
                <c.MenuHeader label="Label and icon" icon="checkmark"/>
              </c.Menu>
            </c.Example>

          </c.PageSection>

          <c.PageSection title="Appearance">

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

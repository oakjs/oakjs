"use strict";
import React from "react";

// use stack components
import components from "../../components";

export default class ButtonCard extends React.Component {
  render() {
    const { Card, Example, Page, PageSidebar, Section } = components;
    const { Dropdown, Divider, Menu, MenuItem, MenuHeader } = components;
    return (
      <Card id="Button" title="<Button> Examples">
        <PageSidebar/>
        <Page title="Dropdown" description="...TODOC...">
          <Section>
            <Example title="Basic dropdown">
              <Dropdown placeholder="Foo" appearance="button" selectable multiSelect icon="heart" showArrow={true}>
                <Menu>
                  <MenuItem label="Yah"/>
                  <MenuItem label="Hoo"/>
                </Menu>
              </Dropdown>
            </Example>
          </Section>
        </Page>
      </Card>
    );
  }
}

"use strict";
import React from "react";

// use stack components
import $ from "../../components";

export default function Dropdown(props) {
  return (
    <$.Card id="Dropdown" title="<Dropdown> Examples">
      <$.PageSidebar/>
      <$.Page title="Dropdown" description="...TODOC...">
        <$.Section title="Todo">
          <$.Example title="Basic dropdown">
            <$.Dropdown placeholder="Foo" appearance="button" selectable multiSelect icon="heart" showArrow={true}>
              <$.Menu>
                <$.MenuItem label="Yah"/>
                <$.MenuItem label="Hoo"/>
              </$.Menu>
            </$.Dropdown>
          </$.Example>
        </$.Section>
      </$.Page>
    </$.Card>
  );
}

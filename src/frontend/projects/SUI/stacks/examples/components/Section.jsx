import React from "react";

// load theme/oak components
// TODO: pick these up from stack.components via context?
import * as themeComponents from "themes/SUI/";
import * as oakComponents from "oak/components";
const components = Object.assign(themeComponents, oakComponents);

export default function Section(props) {
  const { Header, Segment, Spacer } = components;
  const { title } = props;
  return (
    <Segment appearance="basic very padded">
      <Header size="large" dividing>
        {title}
      </Header>
      {props.children}
    </Segment>
  );
}

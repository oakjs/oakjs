import React, { PropTypes } from "react";

// load theme/oak components
// TODO: pick these up from stack.components via context?
import * as themeComponents from "themes/SUI/";
import * as oakComponents from "oak/components";
const components = Object.assign(themeComponents, oakComponents);

function Section(props, context) {
  const { Header, Segment, Spacer } = components;
  return (
    <Segment appearance="basic very padded">
      <Header size="large" dividing>
        {props.title}
      </Header>
      {props.children}
    </Segment>
  );
}

// Pull context in so we can get components from the stack.
Section.contextTypes = {
  project: PropTypes.any,
  stack: PropTypes.any,
  card: PropTypes.any
};

// Add `render` method so we'll get hot reload
Section.render = Function.prototype;

export default Section;

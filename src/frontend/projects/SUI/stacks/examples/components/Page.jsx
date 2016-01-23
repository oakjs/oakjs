import React, { PropTypes } from "react";

function Page(props, context) {
  const { Container, Divider, Header, Pusher, Segment, Spacer, SubHeader } = context.stack.components;
  return (
    <Pusher className="Page" style={{marginRight: 260}}>
      <Segment appearance="basic unpadded">
        <Segment appearance="basic very padded">
          <Header size="huge">
            {props.title}
            <SubHeader>
              {props.description}
            </SubHeader>
          </Header>
        </Segment>
        <Divider/>
      </Segment>
      {props.children}
    </Pusher>
  );
}

// Pull context in so we can get components from the stack.
Page.contextTypes = {
  project: PropTypes.any,
  stack: PropTypes.any,
  card: PropTypes.any
};

// Add `render` method so we'll get hot reload
Page.render = Function.prototype;

export default Page;

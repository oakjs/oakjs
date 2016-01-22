import React from "react";

// load project components
import components from "../../../components/";

export default function Page(props) {
  const { Container, Divider, Header, Pusher, Segment, Spacer, SubHeader } = components;
  const { title, description, children } = props;
  return (
    <Pusher className="Page" style={{marginRight: 260}}>
      <Segment appearance="basic unpadded">
        <Segment appearance="basic very padded">
          <Header size="huge">
            {title}
            <SubHeader>
              {description}
            </SubHeader>
          </Header>
        </Segment>
        <Divider/>
      </Segment>
      {children}
    </Pusher>
  );
}

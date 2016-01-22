import React from "react";

// load project components
import components from "../../../components/";

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

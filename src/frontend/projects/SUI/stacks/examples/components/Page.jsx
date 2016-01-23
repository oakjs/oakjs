import React from "react";

// load theme/oak components
// TODO: pick these up from stack.components via context?
import * as themeComponents from "themes/SUI/";
import * as oakComponents from "oak/components";
const components = Object.assign(themeComponents, oakComponents);

export default class Page extends React.Component {
  render() {
    const { Container, Divider, Header, Pusher, Segment, Spacer, SubHeader } = components;
    const { title, description, children } = this.props;
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
}

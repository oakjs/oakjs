import React from "react";

// load theme/oak components
// TODO: pick these up from stack.components via context?
import * as themeComponents from "themes/SUI/";
import * as oakComponents from "oak/components";
const components = Object.assign(themeComponents, oakComponents);
import InfoHint from "./InfoHint";

export default class Example extends React.Component {
  render() {
    const { Header, Popup, Spacer } = components;
    const { title, hint, children } = this.props;

    const outerProps = {
      className: "example"
    }
    return (
      <div {...outerProps}>
        <Spacer size="small"/>
        <Header size="medium">
          {title}
          {hint && <InfoHint text={hint}/>}
        </Header>
        {children}
      </div>
    );
  }
}

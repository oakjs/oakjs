import React from "react";

// load theme/oak components
// TODO: pick these up from stack.components via context?
import * as themeComponents from "themes/SUI/";
import * as oakComponents from "oak/components";
const components = Object.assign(themeComponents, oakComponents);

export default function InfoHint(props) {
  const { Icon, Popup } = components;
  return (
    <span style={{cursor:"pointer", marginLeft:10}}>
      <Icon circular icon="info" appearance="tiny blue inverted"/>
      <Popup {...props}/>
    </span>
  );
}

import React from "react";

// load project components
import components from "../../../components/";

export default function InfoHint(props) {
  const { Icon, Popup } = components;
  return (
    <span style={{cursor:"pointer", marginLeft:10}}>
      <Icon circular icon="info" appearance="tiny blue inverted"/>
      <Popup {...props}/>
    </span>
  );
}

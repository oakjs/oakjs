import React from "react";

// load project components
import components from "../../../components/";
import InfoHint from "./InfoHint";

export default function SectionHeader(props) {
  const { Header, Popup, Spacer } = components;
  const { title, hint, children } = props;

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

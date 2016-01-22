import React from "react";

export default class OakCardContents extends React.Component {
  render() {
    return <div className="contents">{this.props.children}</div>;
  }
}

import React, { PropTypes } from "react";

import { default as Project } from "../projects/SUIBestiary/project";

class Application extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {}

  render() {
    return (
      <Project/>
    );
  }
}

export default Application

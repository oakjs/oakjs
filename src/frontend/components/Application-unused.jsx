import React, { PropTypes } from "react";
import { fetchShouts } from "../actions";
import { connect } from "react-redux";

import SUI, { Menu } from "./SUI";

class Application extends React.Component {
  static propTypes = {
    dispatch: PropTypes.any,
    shouts: PropTypes.arrayOf(PropTypes.string)
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.dispatch(fetchShouts());
  }

  render() {
    return (
      <div>
        <h1>Shouts</h1>
        <ul>
          { this.props.shouts.map((shout, index) => <li key={index}>{shout}</li>) }
        </ul>
      </div>
    );
  }
}

export default connect(state => ({ shouts: state.shouts }))(Application);

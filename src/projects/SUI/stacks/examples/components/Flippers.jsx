import React, { PropTypes } from "react";
import classNames from "oak-roots/util/react";


class Flippers extends React.Component {

  // Pull context in so we can get components.
  static contextTypes = {
    card: PropTypes.any,
    components: PropTypes.any,
  };

  render() {
    const { components:c, card } = this.context;

    // id of the thing we're enabling/disabling
    const { "for":ref } = this.props;

    return (
      <div>
        <c.Spacer/>
        <c.Buttons appearance="icon">
          <c.Button icon="arrow left" onClick={()=>card.refs[ref].flipLeft()}/>
          <c.Button icon="arrow right" onClick={()=>card.refs[ref].flipRight()}/>
        </c.Buttons>

        <c.Spacer inline/>
        <c.Buttons appearance="icon">
          <c.Button icon="arrow up" onClick={()=>card.refs[ref].flipUp()}/>
          <c.Button icon="arrow down" onClick={()=>card.refs[ref].flipDown()}/>
        </c.Buttons>

        <c.Spacer inline/>
        <c.Buttons appearance="icon">
          <c.Button icon="retweet" onClick={()=>card.refs[ref].flipOver()}/>
          <c.Button icon="flipped retweet" onClick={()=>card.refs[ref].flipBack()}/>
        </c.Buttons>
      </div>
    );
  }
}

export default Flippers;

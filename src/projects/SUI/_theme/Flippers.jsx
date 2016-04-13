export default class Flippers extends oak.components.OakComponent {
  render() {
    const { components:c, page } = this.context;

    // id of the thing we're enabling/disabling
    const { "for":ref } = this.props;

    return (
      <div>
        <c.Spacer/>
        <c.Buttons appearance="icon">
          <c.Button icon="arrow left" onClick={()=>page.refs[ref].flipLeft()}/>
          <c.Button icon="arrow right" onClick={()=>page.refs[ref].flipRight()}/>
        </c.Buttons>

        <c.Spacer inline/>
        <c.Buttons appearance="icon">
          <c.Button icon="arrow up" onClick={()=>page.refs[ref].flipUp()}/>
          <c.Button icon="arrow down" onClick={()=>page.refs[ref].flipDown()}/>
        </c.Buttons>

        <c.Spacer inline/>
        <c.Buttons appearance="icon">
          <c.Button icon="retweet" onClick={()=>page.refs[ref].flipOver()}/>
          <c.Button icon="flipped retweet" onClick={()=>page.refs[ref].flipBack()}/>
        </c.Buttons>
      </div>
    );
  }
}


import { editify } from "oak/EditorProps";
editify({ droppable: false }, Flippers);

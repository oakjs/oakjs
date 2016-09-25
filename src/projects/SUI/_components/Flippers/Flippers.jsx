const { OakComponent } = oak.components.Oak;
export default class Flippers extends OakComponent {
  render() {
    const { page } = this.context;
    const { Oak, SUI } = this.context.components;

    // id of the thing we're enabling/disabling
    const { "for":ref } = this.props;

    return (
      <div>
        <Oak.Spacer/>
        <SUI.Buttons appearance="icon">
          <SUI.Button icon="arrow left" onClick={()=>page.refs[ref].flipLeft()}/>
          <SUI.Button icon="arrow right" onClick={()=>page.refs[ref].flipRight()}/>
        </SUI.Buttons>

        <Oak.Spacer inline/>
        <SUI.Buttons appearance="icon">
          <SUI.Button icon="arrow up" onClick={()=>page.refs[ref].flipUp()}/>
          <SUI.Button icon="arrow down" onClick={()=>page.refs[ref].flipDown()}/>
        </SUI.Buttons>

        <Oak.Spacer inline/>
        <SUI.Buttons appearance="icon">
          <SUI.Button icon="retweet" onClick={()=>page.refs[ref].flipOver()}/>
          <SUI.Button icon="flipped retweet" onClick={()=>page.refs[ref].flipBack()}/>
        </SUI.Buttons>
      </div>
    );
  }
}


import DragProps from "oak-roots/DragProps";
DragProps.register("", { droppable: false }, Flippers);

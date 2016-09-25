const { OakComponent } = oak.components.Oak;
export default class InfoHint extends OakComponent {
  render() {
    const { SUI } = this.context.components;
    return (
      <span style={{cursor:"pointer", marginLeft:10}}>
        <SUI.Icon circular icon="info" appearance="tiny grey inverted"/>
        <SUI.Popup appearance="very wide" {...this.props}/>
      </span>
    );
  }
}


import DragProps from "oak/DragProps";
DragProps.register("", { droppable: false }, InfoHint);
